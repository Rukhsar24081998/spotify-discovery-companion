import { NextResponse } from "next/server";
import {
  MIN_RECOMMENDATIONS,
  type CandidateTrack,
  type DiscoveryContext,
  type ErrorCode,
} from "@/types";
import { generatePlan, GroqError } from "@/lib/groq";
import { searchTracks, SpotifyError } from "@/lib/spotify";
import { rankCandidatesStub } from "@/lib/ranking";
import {
  createErrorResponse,
  statusForErrorCode,
  validateDiscoverInput,
} from "@/lib/utils";
import { devLog } from "@/lib/log";

/**
 * Phase 07 interim response. The route stops at ordered candidate tracks (stub).
 * Phase 08 replaces the stub with real AI ranking and returns the final
 * DiscoverResponse (Recommendation[] with Discovery Scores + explanations).
 */
interface DiscoverOrchestrationResponse {
  rankedCandidates: CandidateTrack[];
  candidatePool: CandidateTrack[];
  meta: { limited: boolean; returnedCount: number };
}

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
 * Deterministic broadening (no second Groq call): drop the most-specific
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

/** POST /api/discover — orchestrates planning + search + ranking stub (Phase 07). */
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
    const candidatePool = dedupeByTrackId(candidates);
    devLog(
      `[discover] spotify search ${elapsedMs(searchStart)}ms (candidates=${candidatePool.length})`,
    );

    const rankingStart = performance.now();
    const rankedCandidates = rankCandidatesStub(candidatePool);
    devLog(
      `[discover] ranking stub ${elapsedMs(rankingStart)}ms (ranked=${rankedCandidates.length})`,
    );

    const response: DiscoverOrchestrationResponse = {
      rankedCandidates,
      candidatePool,
      meta: {
        limited: rankedCandidates.length < MIN_RECOMMENDATIONS,
        returnedCount: rankedCandidates.length,
      },
    };

    devLog(`[discover] total ${elapsedMs(startedAt)}ms`);
    // NO_RESULTS semantics: an empty pool returns HTTP 200 with empty arrays,
    // not an error envelope (tech-stack.md → Spotify Edge Cases).
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
