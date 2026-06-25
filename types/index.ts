/**
 * Shared data contracts for the Spotify Discovery Companion.
 *
 * Single source of truth imported by both client and server. Every shape here
 * is derived directly from `docs/tech-stack.md` and `docs/ai-workflow.md` to
 * prevent type drift between phases. See Phase 02 — Shared Architecture.
 */

// ---------------------------------------------------------------------------
// Canonical enums & constants (see cursor-rules.md → Canonical Terminology)
// ---------------------------------------------------------------------------

export const MOODS = ['Happy', 'Calm', 'Focused', 'Energetic', 'Nostalgic'] as const;
export type Mood = (typeof MOODS)[number];

export const ACTIVITIES = ['Workout', 'Studying', 'Working', 'Driving', 'Relaxing'] as const;
export type Activity = (typeof ACTIVITIES)[number];

export const FEEDBACK_REASONS = [
  'Too energetic',
  'Wrong mood',
  "Didn't like the vocals",
  'Already know this artist',
] as const;
export type FeedbackReason = (typeof FEEDBACK_REASONS)[number];

export const MAX_FAVORITE_ARTISTS = 3;
export const MAX_ARTIST_NAME_LENGTH = 80;
export const TARGET_RECOMMENDATIONS = 5;
export const MIN_RECOMMENDATIONS = 3;

export const MIN_DISCOVERY_SCORE = 0;
export const MAX_DISCOVERY_SCORE = 100;

// ---------------------------------------------------------------------------
// Core domain objects
// ---------------------------------------------------------------------------

/** A single recommendation card returned to the client. Matches tech-stack.md exactly. */
export interface Recommendation {
  trackId: string;
  title: string;
  artist: string;
  albumArt: string;
  /** null when Spotify provides no preview for this track. */
  previewUrl: string | null;
  spotifyUrl: string;
  /** Integer 0–100, rendered to the user as "Discovery Match". */
  discoveryScore: number;
  /** <= 3 sentences, no technical jargon. */
  explanation: string;
}

/** A raw candidate track retrieved from Spotify Search (~20 per discovery). */
export interface CandidateTrack {
  trackId: string;
  title: string;
  artist: string;
  albumArt: string;
  previewUrl: string | null;
  spotifyUrl: string;
  /** Spotify popularity (0–100); used as a discovery/tie-break signal. */
  popularity: number;
}

/** An artist autocomplete suggestion for ArtistSearch. */
export interface ArtistSuggestion {
  id: string;
  name: string;
  image: string;
}

/**
 * The normalized, validated discovery context derived from user input.
 * Unlike DiscoverRequest, `favoriteArtists` is always present (possibly empty)
 * after sanitization, so services can rely on it.
 */
export interface DiscoveryContext {
  mood: Mood;
  activity: Activity;
  favoriteArtists: string[];
}

// ---------------------------------------------------------------------------
// Groq AI outputs (see ai-workflow.md → Expected AI Output)
// ---------------------------------------------------------------------------

/** Groq Call 1 — inferred user intent. */
export interface DiscoveryIntent {
  energy: string;
  emotionalTone: string;
  listeningContext: string;
  familiarityPreference: string;
  discoveryIntent: string;
}

/** Groq Call 1 — discovery strategy guiding the Spotify search. */
export interface DiscoveryStrategy {
  energy: string;
  context: string;
  goal: string;
  language: string[];
  avoid: string[];
  tempo: string;
}

/** Groq Call 1 — combined planning output. */
export interface PlanningResult {
  intent: DiscoveryIntent;
  strategy: DiscoveryStrategy;
  searchQuery: string;
}

/** Groq Call 2 — a single ranked item as returned by the model (pre-composition). */
export interface RankedTrack {
  trackId: string;
  /** Integer 0–100; clamped/rounded by the backend before use. */
  score: number;
  explanation: string;
}

/** Groq Call 2 — raw ranking output. */
export interface RankingResult {
  recommendations: RankedTrack[];
}

/** Input to the Groq ranking call (Call 2). */
export interface RankingInput {
  context: DiscoveryContext;
  intent: DiscoveryIntent;
  strategy: DiscoveryStrategy;
  candidates: CandidateTrack[];
}

/** Input to the Groq feedback re-ranking call. Re-ranks the cached pool only. */
export interface RerankInput {
  context: DiscoveryContext;
  candidates: CandidateTrack[];
  shownTrackIds: string[];
  skippedTrackIds: string[];
  reasons: FeedbackReason[];
}

// ---------------------------------------------------------------------------
// API route I/O — POST /api/discover
// ---------------------------------------------------------------------------

export interface DiscoverRequest {
  mood: Mood;
  activity: Activity;
  favoriteArtists?: string[];
}

export interface DiscoveryMeta {
  /** true when fewer than MIN_RECOMMENDATIONS were produced after fallback. */
  limited: boolean;
  returnedCount: number;
}

export interface DiscoverResponse {
  recommendations: Recommendation[];
  /** Full candidate set, replayed by the client to /api/feedback. */
  candidatePool: CandidateTrack[];
  meta: DiscoveryMeta;
}

// ---------------------------------------------------------------------------
// API route I/O — POST /api/feedback
// ---------------------------------------------------------------------------

export interface FeedbackRequest {
  /** Original discovery context; same validation rules as /api/discover. */
  context: DiscoverRequest;
  candidatePool: CandidateTrack[];
  shownTrackIds: string[];
  skippedTrackIds: string[];
  reasons: FeedbackReason[];
}

/** Feedback re-ranking returns the same shape as /api/discover. */
export type FeedbackResponse = DiscoverResponse;

// ---------------------------------------------------------------------------
// API route I/O — GET /api/spotify/search
// ---------------------------------------------------------------------------

export interface SpotifySearchQuery {
  q: string;
  /** Fixed to "artist" for the MVP. */
  type: 'artist';
}

export interface SpotifySearchResponse {
  artists: ArtistSuggestion[];
}

// ---------------------------------------------------------------------------
// Error envelope (see tech-stack.md → API Routes)
// ---------------------------------------------------------------------------

export type ErrorCode =
  | 'INVALID_INPUT'
  | 'SPOTIFY_AUTH_FAILED'
  | 'SPOTIFY_UNAVAILABLE'
  | 'GROQ_UNAVAILABLE'
  | 'NO_RESULTS'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export interface ApiError {
  code: ErrorCode;
  message: string;
}

export interface ErrorResponse {
  error: ApiError;
}

// ---------------------------------------------------------------------------
// Validation helper contract
// ---------------------------------------------------------------------------

/** Discriminated result for input validation helpers in lib/utils.ts. */
export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ApiError };
