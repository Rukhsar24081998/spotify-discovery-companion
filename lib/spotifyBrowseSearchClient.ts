import type { SpotifyBrowseSearchResponse } from "@/types";
import { BROWSE_SEARCH_LIMIT, MIN_BROWSE_SEARCH_LENGTH } from "@/types";

const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 50;

interface CacheEntry {
  data: SpotifyBrowseSearchResponse;
  cachedAt: number;
}

const browseSearchCache = new Map<string, CacheEntry>();

const EMPTY_RESPONSE: SpotifyBrowseSearchResponse = {
  topResult: null,
  tracks: [],
  artists: [],
  albums: [],
  playlists: [],
};

function cacheKey(query: string): string {
  return query.trim().toLowerCase();
}

function getCached(query: string): SpotifyBrowseSearchResponse | null {
  const key = cacheKey(query);
  const entry = browseSearchCache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    browseSearchCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(query: string, data: SpotifyBrowseSearchResponse): void {
  const key = cacheKey(query);
  if (browseSearchCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = browseSearchCache.keys().next().value;
    if (oldestKey) {
      browseSearchCache.delete(oldestKey);
    }
  }
  browseSearchCache.set(key, { data, cachedAt: Date.now() });
}

/**
 * Fetches grouped Spotify browse search results via GET /api/spotify/search.
 * Responses are cached in-memory by normalized query for faster repeat lookups.
 */
export async function fetchBrowseSearch(
  query: string,
  signal?: AbortSignal,
): Promise<SpotifyBrowseSearchResponse> {
  const trimmed = query.trim();
  if (trimmed.length < MIN_BROWSE_SEARCH_LENGTH) {
    return EMPTY_RESPONSE;
  }

  const cached = getCached(trimmed);
  if (cached) {
    return cached;
  }

  const params = new URLSearchParams({
    q: trimmed,
    type: "browse",
  });

  const response = await fetch(`/api/spotify/search?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Spotify search request failed.");
  }

  const data = (await response.json()) as SpotifyBrowseSearchResponse;
  setCached(trimmed, data);
  return data;
}

/** @internal Test helper — clears the in-memory browse search cache. */
export function clearBrowseSearchCache(): void {
  browseSearchCache.clear();
}
