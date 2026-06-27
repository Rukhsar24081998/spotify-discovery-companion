/**
 * Spotify Web API service. All Spotify access is encapsulated here; routes
 * orchestrate, this module performs I/O (see tech-stack.md → Scalability).
 *
 * Auth uses the Client Credentials flow (no user login) with an in-memory
 * token cache. Upstream failures are mapped to the shared error envelope via
 * SpotifyError + ErrorCode so routes can respond consistently.
 */

import type {
  ArtistSuggestion,
  BrowseSearchItem,
  CandidateTrack,
  ErrorCode,
  SpotifyBrowseSearchResponse,
} from "@/types";
import { devLog } from "@/lib/log";
import { spotifyExternalUrl } from "@/lib/spotifyLinks";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";
const TOKEN_SAFETY_MARGIN_MS = 60_000;
const MAX_RETRY_AFTER_MS = 2_000;
// Spotify development-mode quota caps Search `limit` at 10, so we page with
// `offset` to assemble the documented ~20 candidates.
const SEARCH_PAGE_SIZE = 10;

/** Error carrying a shared ErrorCode so API routes can map it to the envelope. */
export class SpotifyError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = "SpotifyError";
    this.code = code;
  }
}

// ---------------------------------------------------------------------------
// Minimal shapes for the Spotify responses we consume
// ---------------------------------------------------------------------------

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

interface SpotifyArtistObject {
  id: string;
  name: string;
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
}

interface SpotifyAlbumObject {
  id: string;
  name: string;
  artists: { name: string }[];
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
}

interface SpotifyMultiSearchResponse {
  tracks?: { items: SpotifyTrackObject[] };
  artists?: { items: SpotifyArtistObject[] };
  albums?: { items: SpotifyAlbumObject[] };
}

interface SpotifyTrackObject {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images?: SpotifyImage[] };
  preview_url: string | null;
  external_urls?: { spotify?: string };
  popularity?: number;
  is_playable?: boolean;
  is_local?: boolean;
}

interface SpotifyTrackSearchResponse {
  tracks?: { items: SpotifyTrackObject[] };
}

interface SpotifyArtistSearchResponse {
  artists?: { items: SpotifyArtistObject[] };
}

// ---------------------------------------------------------------------------
// Token cache + auth
// ---------------------------------------------------------------------------

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestToken(): Promise<SpotifyTokenResponse> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new SpotifyError(
      "SPOTIFY_AUTH_FAILED",
      "Spotify credentials are not configured.",
    );
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new SpotifyError(
      "SPOTIFY_AUTH_FAILED",
      `Spotify token request failed (${response.status}).`,
    );
  }

  return (await response.json()) as SpotifyTokenResponse;
}

/**
 * Obtain a Spotify access token via Client Credentials, served from an
 * in-memory cache until expiry minus a 60s safety margin. Retries once.
 */
export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - TOKEN_SAFETY_MARGIN_MS) {
    return cachedToken.accessToken;
  }

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const token = await requestToken();
      cachedToken = {
        accessToken: token.access_token,
        expiresAt: Date.now() + token.expires_in * 1000,
      };
      devLog(
        `Token acquired. Spotify authentication successful. Token expires in ${token.expires_in}s.`,
      );
      return token.access_token;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError instanceof SpotifyError) {
    throw lastError;
  }
  throw new SpotifyError("SPOTIFY_AUTH_FAILED", "Spotify authentication failed.");
}

// ---------------------------------------------------------------------------
// Authenticated GET with 401 refresh + 429 retry-once
// ---------------------------------------------------------------------------

function buildUrl(path: string, params: Record<string, string>): string {
  const url = new URL(`${API_BASE}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

async function spotifyGet(
  path: string,
  params: Record<string, string>,
): Promise<unknown> {
  const url = buildUrl(path, params);

  let token = await getAccessToken();
  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    cachedToken = null;
    token = await getAccessToken();
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (response.status === 429) {
    const retryAfterSeconds = Number(response.headers.get("retry-after") ?? "1");
    const waitMs = Math.min(
      Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : 1000,
      MAX_RETRY_AFTER_MS,
    );
    await sleep(waitMs);
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 429) {
      throw new SpotifyError("RATE_LIMITED", "Spotify is busy. Please try again shortly.");
    }
  }

  if (!response.ok) {
    throw new SpotifyError(
      "SPOTIFY_UNAVAILABLE",
      `Spotify request failed (${response.status}).`,
    );
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Mapping + filtering
// ---------------------------------------------------------------------------

/** Include the `market` param only when SPOTIFY_MARKET is set (optional config). */
function marketParam(): Record<string, string> {
  const market = process.env.SPOTIFY_MARKET?.trim();
  return market ? { market } : {};
}

/** Drop local, unplayable, or unlinkable (region-restricted) tracks. */
function isUsableTrack(track: SpotifyTrackObject): boolean {
  if (!track.id || track.is_local) {
    return false;
  }
  if (track.is_playable === false) {
    return false;
  }
  if (!spotifyExternalUrl(track)) {
    return false;
  }
  return true;
}

function toCandidateTrack(track: SpotifyTrackObject): CandidateTrack {
  return {
    trackId: track.id,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    albumArt: track.album.images?.[0]?.url ?? "",
    previewUrl: track.preview_url ?? null,
    spotifyUrl: spotifyExternalUrl(track) ?? "",
    popularity: track.popularity ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Public search functions
// ---------------------------------------------------------------------------

/**
 * Search Spotify for tracks and map to CandidateTrack (~20 candidates by
 * default). preview_url is kept nullable; tracks are not dropped for lacking one.
 */
export async function searchTracks(query: string, limit = 20): Promise<CandidateTrack[]> {
  const q = query.trim();
  if (!q) {
    return [];
  }

  devLog(`Searching tracks... query="${q}" limit=${limit}`);

  const rawItems: SpotifyTrackObject[] = [];
  for (let offset = 0; offset < limit; offset += SEARCH_PAGE_SIZE) {
    const pageLimit = Math.min(SEARCH_PAGE_SIZE, limit - offset);
    const json = (await spotifyGet("search", {
      q,
      type: "track",
      limit: String(pageLimit),
      offset: String(offset),
      ...marketParam(),
    })) as SpotifyTrackSearchResponse;

    const items = json.tracks?.items ?? [];
    rawItems.push(...items);
    if (items.length < pageLimit) {
      break;
    }
  }

  const candidates = rawItems.filter(isUsableTrack).map(toCandidateTrack);
  const withPreview = candidates.filter((track) => track.previewUrl !== null).length;
  devLog(`Preview availability: ${withPreview} / ${candidates.length} tracks`);

  return candidates;
}

function pickImageUrl(images?: SpotifyImage[]): string {
  if (!images?.length) {
    return "";
  }
  const sorted = [...images].sort(
    (a, b) => (b.width ?? 0) - (a.width ?? 0),
  );
  return sorted[0]?.url ?? "";
}

function toBrowseTrack(track: SpotifyTrackObject): BrowseSearchItem | null {
  const spotifyUrl = spotifyExternalUrl(track);
  if (!track.id || !spotifyUrl) {
    return null;
  }
  return {
    id: track.id,
    type: "track",
    title: track.name,
    subtitle: track.artists.map((artist) => artist.name).join(", "),
    imageUrl: pickImageUrl(track.album.images),
    spotifyUrl,
  };
}

function toBrowseArtist(artist: SpotifyArtistObject): BrowseSearchItem | null {
  const spotifyUrl = spotifyExternalUrl(artist);
  if (!artist.id || !spotifyUrl) {
    return null;
  }
  return {
    id: artist.id,
    type: "artist",
    title: artist.name,
    subtitle: "Artist",
    imageUrl: pickImageUrl(artist.images),
    spotifyUrl,
  };
}

function toBrowseAlbum(album: SpotifyAlbumObject): BrowseSearchItem | null {
  const spotifyUrl = spotifyExternalUrl(album);
  if (!album.id || !spotifyUrl) {
    return null;
  }
  return {
    id: album.id,
    type: "album",
    title: album.name,
    subtitle: album.artists.map((artist) => artist.name).join(", "),
    imageUrl: pickImageUrl(album.images),
    spotifyUrl,
  };
}

/**
 * Search Spotify for tracks, artists, and albums (top-bar browse search).
 * Uses a single multi-type search request; omits items without external_urls.spotify.
 */
export async function searchBrowse(
  query: string,
  limit = 5,
): Promise<SpotifyBrowseSearchResponse> {
  const q = query.trim();
  if (!q) {
    return { tracks: [], artists: [], albums: [] };
  }

  devLog(`Browse search... query="${q}" limit=${limit} per type`);

  const json = (await spotifyGet("search", {
    q,
    type: "track,artist,album",
    limit: String(limit),
    ...marketParam(),
  })) as SpotifyMultiSearchResponse;

  const tracks = (json.tracks?.items ?? [])
    .map(toBrowseTrack)
    .filter((item): item is BrowseSearchItem => item !== null)
    .slice(0, limit);

  const artists = (json.artists?.items ?? [])
    .map(toBrowseArtist)
    .filter((item): item is BrowseSearchItem => item !== null)
    .slice(0, limit);

  const albums = (json.albums?.items ?? [])
    .map(toBrowseAlbum)
    .filter((item): item is BrowseSearchItem => item !== null)
    .slice(0, limit);

  return { tracks, artists, albums };
}

/** Search Spotify for artists to back the ArtistSearch autocomplete. */
export async function searchArtists(query: string, limit = 5): Promise<ArtistSuggestion[]> {
  const q = query.trim();
  if (!q) {
    return [];
  }

  devLog(`Searching artists... query="${q}" limit=${limit}`);
  const json = (await spotifyGet("search", {
    q,
    type: "artist",
    limit: String(limit),
  })) as SpotifyArtistSearchResponse;

  const items = json.artists?.items ?? [];
  return items.map((artist) => ({
    id: artist.id,
    name: artist.name,
    image: artist.images?.[0]?.url ?? "",
  }));
}

function extractSpotifyTrackId(spotifyUrl: string): string | null {
  const match = spotifyUrl.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
  return match?.[1] ?? null;
}

/** Fetch preview_url for a Spotify track link, if the API provides one. */
export async function getTrackPreviewUrl(spotifyTrackUrl: string): Promise<string | null> {
  const trackId = extractSpotifyTrackId(spotifyTrackUrl);
  if (!trackId) {
    return null;
  }

  devLog(`Fetching preview_url for track id=${trackId}`);

  const json = (await spotifyGet(`tracks/${trackId}`, marketParam())) as SpotifyTrackObject;
  return json.preview_url ?? null;
}
