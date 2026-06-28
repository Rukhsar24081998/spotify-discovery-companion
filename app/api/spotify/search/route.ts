import { NextResponse } from "next/server";
import type {
  ErrorCode,
  SpotifyBrowseSearchResponse,
  SpotifySearchResponse,
} from "@/types";
import { MIN_BROWSE_SEARCH_LENGTH, BROWSE_SEARCH_LIMIT } from "@/types";
import { searchArtists, searchBrowse, getTrackPreviewUrl, SpotifyError } from "@/lib/spotify";
import {
  createErrorResponse,
  statusForErrorCode,
  validateSearchQuery,
} from "@/lib/utils";
import { devLog } from "@/lib/log";

const ARTIST_SUGGESTION_LIMIT = 5;

const EMPTY_BROWSE: SpotifyBrowseSearchResponse = {
  topResult: null,
  tracks: [],
  artists: [],
  albums: [],
  playlists: [],
};

/** GET /api/spotify/search — artist autocomplete or multi-type browse search. */
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") ?? "";
  const searchType = searchParams.get("type") ?? "browse";

  if (rawQuery.trim() === "") {
    if (searchType === "artist") {
      return NextResponse.json({ artists: [] } satisfies SpotifySearchResponse);
    }
    return NextResponse.json(EMPTY_BROWSE);
  }

  const validated = validateSearchQuery(rawQuery);
  if (!validated.ok) {
    return NextResponse.json(
      createErrorResponse(validated.error.code, validated.error.message),
      { status: statusForErrorCode(validated.error.code) },
    );
  }

  try {
    if (searchType === "track-preview") {
      const spotifyUrl = searchParams.get("url") ?? "";
      if (!spotifyUrl.trim()) {
        return NextResponse.json({ previewUrl: null });
      }
      const previewUrl = await getTrackPreviewUrl(spotifyUrl);
      return NextResponse.json({ previewUrl });
    }

    if (searchType === "artist") {
      const artists = await searchArtists(validated.value, ARTIST_SUGGESTION_LIMIT);
      return NextResponse.json({ artists } satisfies SpotifySearchResponse);
    }

    if (validated.value.length < MIN_BROWSE_SEARCH_LENGTH) {
      return NextResponse.json(EMPTY_BROWSE);
    }

    const results = await searchBrowse(validated.value, BROWSE_SEARCH_LIMIT);
    return NextResponse.json(results);
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
