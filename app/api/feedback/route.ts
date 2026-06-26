import { NextResponse } from "next/server";
import {
  MIN_RECOMMENDATIONS,
  type CandidateTrack,
  type DiscoverResponse,
  type DiscoveryContext,
  type ErrorCode,
  type FeedbackReason,
  type Recommendation,
} from "@/types";
import { GroqError, rerankCandidates } from "@/lib/groq";
import { searchTracks, SpotifyError } from "@/lib/spotify";
import { composeRecommendations, reconcileRanking } from "@/lib/ranking";
import {
  createErrorResponse,
  statusForErrorCode,
  validateFeedbackInput,
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

function contextBroadenedQuery(context: DiscoveryContext): string {
  return `${context.mood} ${context.activity}`.toLowerCase();
}

function filterRemainingPool(
  candidatePool: CandidateTrack[],
  excludedIds: Set<string>,
): CandidateTrack[] {
  return candidatePool.filter((track) => !excludedIds.has(track.trackId));
}

function errorCodeOf(error: unknown): ErrorCode {
  if (error instanceof SpotifyError || error instanceof GroqError) {
    return error.code;
  }
  return "INTERNAL_ERROR";
}

async function rerankAndCompose(
  context: DiscoveryContext,
  candidatePool: CandidateTrack[],
  remaining: CandidateTrack[],
  shownTrackIds: string[],
  skippedTrackIds: string[],
  reasons: FeedbackReason[],
): Promise<Recommendation[]> {
  if (remaining.length === 0) {
    return [];
  }

  const ranking = await rerankCandidates({
    context,
    candidates: remaining,
    shownTrackIds,
    skippedTrackIds,
    reasons,
  });

  const excludedIds = new Set([...shownTrackIds, ...skippedTrackIds]);
  const reconciled = reconcileRanking(ranking, remaining).filter(
    (item) => !excludedIds.has(item.trackId),
  );
  return composeRecommendations(reconciled, candidatePool);
}

/** POST /api/feedback — re-ranks remaining cached candidates using session feedback. */
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
  const validated = validateFeedbackInput(body);
  devLog(`[feedback] validation ${elapsedMs(validationStart)}ms`);
  if (!validated.ok) {
    return NextResponse.json(
      createErrorResponse(validated.error.code, validated.error.message),
      { status: statusForErrorCode(validated.error.code) },
    );
  }

  const { context, candidatePool: initialPool, shownTrackIds, skippedTrackIds, reasons } =
    validated.value;

  if (reasons.length === 0) {
    return NextResponse.json(
      createErrorResponse("INVALID_INPUT", "At least one feedback reason is required."),
      { status: statusForErrorCode("INVALID_INPUT") },
    );
  }

  const discoveryContext: DiscoveryContext = {
    mood: context.mood,
    activity: context.activity,
    favoriteArtists: context.favoriteArtists ?? [],
  };

  const excludedIds = new Set([...shownTrackIds, ...skippedTrackIds]);
  let candidatePool = dedupeByTrackId(initialPool);
  let remaining = filterRemainingPool(candidatePool, excludedIds);

  try {
    if (remaining.length < MIN_RECOMMENDATIONS) {
      const broadenedQuery = contextBroadenedQuery(discoveryContext);
      const searchStart = performance.now();
      const more = await searchTracks(broadenedQuery);
      candidatePool = dedupeByTrackId([...candidatePool, ...more]);
      remaining = filterRemainingPool(candidatePool, excludedIds);
      devLog(
        `[feedback] exhaustion broadened search ${elapsedMs(searchStart)}ms (pool=${candidatePool.length}, remaining=${remaining.length})`,
      );
    }

    const rankingStart = performance.now();
    const recommendations = await rerankAndCompose(
      discoveryContext,
      candidatePool,
      remaining,
      shownTrackIds,
      skippedTrackIds,
      reasons,
    );
    devLog(
      `[feedback] re-ranking ${elapsedMs(rankingStart)}ms (recommendations=${recommendations.length})`,
    );

    const response: DiscoverResponse = {
      recommendations,
      candidatePool,
      meta: {
        limited: recommendations.length < MIN_RECOMMENDATIONS,
        returnedCount: recommendations.length,
      },
    };

    devLog(`[feedback] total ${elapsedMs(startedAt)}ms`);
    return NextResponse.json(response);
  } catch (error) {
    const code = errorCodeOf(error);
    devLog(
      `[feedback] failed (${code}): ${error instanceof Error ? error.message : "unknown error"}`,
    );
    return NextResponse.json(createErrorResponse(code), {
      status: statusForErrorCode(code),
    });
  }
}
