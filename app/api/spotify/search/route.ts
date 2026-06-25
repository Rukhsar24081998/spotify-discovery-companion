import { NextResponse } from "next/server";
import type { ErrorCode, SpotifySearchResponse } from "@/types";
import { searchArtists, SpotifyError } from "@/lib/spotify";
import {
  createErrorResponse,
  statusForErrorCode,
  validateSearchQuery,
} from "@/lib/utils";
import { devLog } from "@/lib/log";

const ARTIST_SUGGESTION_LIMIT = 5;

/** GET /api/spotify/search — artist autocomplete proxy (Phase 05). */
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") ?? "";

  // Empty q returns an empty list with no Spotify call (tech-stack.md).
  if (rawQuery.trim() === "") {
    return NextResponse.json({ artists: [] } satisfies SpotifySearchResponse);
  }

  const validated = validateSearchQuery(rawQuery);
  if (!validated.ok) {
    return NextResponse.json(
      createErrorResponse(validated.error.code, validated.error.message),
      { status: statusForErrorCode(validated.error.code) },
    );
  }

  try {
    const artists = await searchArtists(validated.value, ARTIST_SUGGESTION_LIMIT);
    return NextResponse.json({ artists } satisfies SpotifySearchResponse);
  } catch (error) {
    const code: ErrorCode =
      error instanceof SpotifyError ? error.code : "INTERNAL_ERROR";
    devLog(
      `/api/spotify/search failed: ${error instanceof Error ? error.message : "unknown error"}`,
    );
    return NextResponse.json(createErrorResponse(code), {
      status: statusForErrorCode(code),
    });
  }
}
