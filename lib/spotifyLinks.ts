/**
 * Single source of truth for Spotify link resolution.
 *
 * - Real entities: use `external_urls.spotify` from the Spotify Web API (never construct from IDs).
 * - Fictional / personalized items: fall back to Spotify Search.
 */

export type SpotifyExternalUrls = {
  external_urls?: { spotify?: string };
};

/** Read `external_urls.spotify` from a Spotify API object. */
export function spotifyExternalUrl(
  object: SpotifyExternalUrls | null | undefined,
): string | null {
  const url = object?.external_urls?.spotify?.trim();
  return url || null;
}

/** Spotify Search URL for items without a real entity link (Daily Mix, AI Mix, etc.). */
export function spotifySearchUrl(query: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(query.trim())}`;
}

/**
 * Prefer an API-provided Spotify URL; otherwise open Spotify Search for the display name.
 */
export function resolveSpotifyLink(
  apiUrl: string | null | undefined,
  searchName: string,
): string {
  const trimmed = apiUrl?.trim();
  if (trimmed) {
    return trimmed;
  }
  return spotifySearchUrl(searchName);
}
