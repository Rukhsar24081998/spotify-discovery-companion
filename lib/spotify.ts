/**
 * Spotify Web API service. All Spotify access is encapsulated here; routes
 * orchestrate, this module performs I/O (see tech-stack.md → Scalability).
 *
 * Phase 02 exposes the final signatures only. Token caching, Search, and the
 * mapping to CandidateTrack/ArtistSuggestion are implemented in Phase 05.
 */

import type { ArtistSuggestion, CandidateTrack } from '@/types';

/**
 * Obtain a Spotify access token via the Client Credentials flow, served from
 * an in-memory cache until expiry (with a safety margin).
 */
export async function getAccessToken(): Promise<string> {
  throw new Error('spotify.getAccessToken not implemented (Phase 05).');
}

/**
 * Search Spotify for tracks matching the discovery query and map the results to
 * CandidateTrack objects (~20 candidates by default).
 */
export async function searchTracks(query: string, limit = 20): Promise<CandidateTrack[]> {
  throw new Error(
    `spotify.searchTracks not implemented (Phase 05). query="${query}", limit=${limit}.`,
  );
}

/**
 * Search Spotify for artists to back the ArtistSearch autocomplete.
 * Returns up to `limit` suggestions.
 */
export async function searchArtists(query: string, limit = 5): Promise<ArtistSuggestion[]> {
  throw new Error(
    `spotify.searchArtists not implemented (Phase 05). query="${query}", limit=${limit}.`,
  );
}
