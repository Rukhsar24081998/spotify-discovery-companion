import { NextResponse } from "next/server";
import {
  MIN_RECOMMENDATIONS,
  type CandidateTrack,
  type DiscoverResponse,
  type DiscoveryContext,
  type ErrorCode,
  type PlanningResult,
  type Recommendation,
} from "@/types";
import { generatePlan, GroqError, rankCandidates } from "@/lib/groq";
import { searchTracks, SpotifyError } from "@/lib/spotify";
import { composeRecommendations, reconcileRanking } from "@/lib/ranking";
import {
  createErrorResponse,
  statusForErrorCode,
  validateDiscoverInput,
} from "@/lib/utils";
import { devLog } from "@/lib/log";

function elapsedMs(since: number): number {
  return Math.round(performance.now() - since);
}

function dedupeByTrackId(tracks: CandidateTrack[]): CandidateTrack[] {
  const seen = new Set<string>();
  const unique: CandidateTrack[] = [];
  for (const track of tracks) {
    if (seen.has(track.trackId)) {
      continue;
    }
    seen.add(track.trackId);
    unique.push(track);
  }
  return unique;
}

/**
 * Deterministic broadening (no extra Groq call): drop the most-specific
 * trailing term; if the query is already short, fall back to mood + activity.
 */
function broadenSearchQuery(query: string, context: DiscoveryContext): string {
  const tokens = query.trim().split(/\s+/);
  if (tokens.length > 2) {
    return tokens.slice(0, -1).join(" ");
  }
  return `${context.mood} ${context.activity}`.toLowerCase();
}

function errorCodeOf(error: unknown): ErrorCode {
  if (error instanceof SpotifyError || error instanceof GroqError) {
    return error.code;
  }
  return "INTERNAL_ERROR";
}

async function rankAndCompose(
  context: DiscoveryContext,
  planning: PlanningResult,
  candidatePool: CandidateTrack[],
): Promise<Recommendation[]> {
  if (candidatePool.length === 0) {
    return [];
  }

  const ranking = await rankCandidates({
    context,
    intent: planning.intent,
    strategy: planning.strategy,
    candidates: candidatePool,
  });

  const reconciled = reconcileRanking(ranking, candidatePool);
  return composeRecommendations(reconciled, candidatePool);
}

/** POST /api/discover — orchestrates planning, search, AI ranking, and composition. */
export async function POST(request: Request): Promise<NextResponse> {
  const startedAt = performance.now();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      createErrorResponse("INVALID_INPUT", "Request body must be valid JSON."),
      { status: statusForErrorCode("INVALID_INPUT") },
    );
  }

  const validationStart = performance.now();
  const validated = validateDiscoverInput(body);
  devLog(`[discover] validation ${elapsedMs(validationStart)}ms`);
  if (!validated.ok) {
    return NextResponse.json(
      createErrorResponse(validated.error.code, validated.error.message),
      { status: statusForErrorCode(validated.error.code) },
    );
  }
  const context = validated.value;

  try {
    const planningStart = performance.now();
    const planning = await generatePlan(context);
    devLog(`[discover] planning ${elapsedMs(planningStart)}ms`);

    const searchStart = performance.now();
    let candidates = await searchTracks(planning.searchQuery);

    if (candidates.length < MIN_RECOMMENDATIONS) {
      const broadenedQuery = broadenSearchQuery(planning.searchQuery, context);
      if (broadenedQuery && broadenedQuery !== planning.searchQuery) {
        const more = await searchTracks(broadenedQuery);
        candidates = dedupeByTrackId([...candidates, ...more]);
      }
    }
    let candidatePool = dedupeByTrackId(candidates);
    devLog(
      `[discover] spotify search ${elapsedMs(searchStart)}ms (candidates=${candidatePool.length})`,
    );

    const rankingStart = performance.now();
    let recommendations = await rankAndCompose(context, planning, candidatePool);

    if (
      recommendations.length < MIN_RECOMMENDATIONS &&
      candidatePool.length > 0
    ) {
      const broadenedQuery = broadenSearchQuery(planning.searchQuery, context);
      if (broadenedQuery && broadenedQuery !== planning.searchQuery) {
        const more = await searchTracks(broadenedQuery);
        candidatePool = dedupeByTrackId([...candidatePool, ...more]);
        recommendations = await rankAndCompose(context, planning, candidatePool);
        devLog(
          `[discover] post-ranking broadened search (pool=${candidatePool.length}, ranked=${recommendations.length})`,
        );
      }
    }

    devLog(
      `[discover] ranking ${elapsedMs(rankingStart)}ms (recommendations=${recommendations.length})`,
    );

    const response: DiscoverResponse = {
      recommendations,
      candidatePool,
      meta: {
        limited: recommendations.length < MIN_RECOMMENDATIONS,
        returnedCount: recommendations.length,
      },
    };

    devLog(`[discover] total ${elapsedMs(startedAt)}ms`);
    return NextResponse.json(response);
  } catch (error) {
    const code = errorCodeOf(error);
    devLog(
      `[discover] failed (${code}): ${error instanceof Error ? error.message : "unknown error"}`,
    );
    return NextResponse.json(createErrorResponse(code), {
      status: statusForErrorCode(code),
    });
  }
}
