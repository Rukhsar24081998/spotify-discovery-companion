/**
 * Shared validation, sanitization, scoring, and error-envelope helpers.
 *
 * Single implementation reused by every API route to avoid duplicated logic
 * (see Phase 02 — Shared Architecture). All user input is treated as untrusted.
 */

import {
  ACTIVITIES,
  FEEDBACK_REASONS,
  MAX_ARTIST_NAME_LENGTH,
  MAX_DISCOVERY_SCORE,
  MAX_FAVORITE_ARTISTS,
  MIN_DISCOVERY_SCORE,
  type Activity,
  type ApiError,
  type DiscoveryContext,
  type ErrorCode,
  type ErrorResponse,
  type FeedbackReason,
  type FeedbackRequest,
  type Mood,
  type ValidationResult,
  MOODS,
} from '@/types';

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

export function isMood(value: unknown): value is Mood {
  return typeof value === 'string' && (MOODS as readonly string[]).includes(value);
}

export function isActivity(value: unknown): value is Activity {
  return typeof value === 'string' && (ACTIVITIES as readonly string[]).includes(value);
}

export function isFeedbackReason(value: unknown): value is FeedbackReason {
  return typeof value === 'string' && (FEEDBACK_REASONS as readonly string[]).includes(value);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// ---------------------------------------------------------------------------
// Sanitization
// ---------------------------------------------------------------------------

/** Trim an artist/search string and cap it at MAX_ARTIST_NAME_LENGTH chars. */
export function sanitizeArtistName(value: string): string {
  return value.trim().slice(0, MAX_ARTIST_NAME_LENGTH);
}

/**
 * Normalize a favorite-artists input: keep only strings, trim, cap length, and
 * drop empty/whitespace-only entries. Does NOT enforce the max-3 rule — count
 * enforcement is a validation concern handled in validateDiscoverInput.
 */
export function sanitizeFavoriteArtists(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map(sanitizeArtistName)
    .filter((entry) => entry.length > 0);
}

// ---------------------------------------------------------------------------
// Score helper
// ---------------------------------------------------------------------------

/** Clamp a score to MIN_DISCOVERY_SCORE..MAX_DISCOVERY_SCORE and round to an integer. */
export function clampScore(score: number): number {
  if (!Number.isFinite(score)) {
    return MIN_DISCOVERY_SCORE;
  }
  const clamped = Math.min(MAX_DISCOVERY_SCORE, Math.max(MIN_DISCOVERY_SCORE, score));
  return Math.round(clamped);
}

// ---------------------------------------------------------------------------
// Error envelope builders (see tech-stack.md → API Routes)
// ---------------------------------------------------------------------------

const DEFAULT_ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID_INPUT: 'Some of the details provided were invalid. Please check and try again.',
  SPOTIFY_AUTH_FAILED: 'We could not connect to Spotify right now. Please try again shortly.',
  SPOTIFY_UNAVAILABLE: 'Spotify is temporarily unavailable. Please try again in a moment.',
  GROQ_UNAVAILABLE: 'The recommendation engine is busy right now. Please try again in a moment.',
  NO_RESULTS: 'We could not find matching tracks. Try adjusting your mood or activity.',
  RATE_LIMITED: 'Spotify is busy at the moment. Please try again in a few seconds.',
  INTERNAL_ERROR: 'Something went wrong on our side. Please try again.',
};

const HTTP_STATUS_BY_CODE: Record<ErrorCode, number> = {
  INVALID_INPUT: 400,
  SPOTIFY_AUTH_FAILED: 502,
  SPOTIFY_UNAVAILABLE: 503,
  GROQ_UNAVAILABLE: 503,
  NO_RESULTS: 200,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

/** Build the canonical error object for a given code. */
export function createApiError(code: ErrorCode, message?: string): ApiError {
  return { code, message: message ?? DEFAULT_ERROR_MESSAGES[code] };
}

/** Build the canonical error response envelope: { error: { code, message } }. */
export function createErrorResponse(code: ErrorCode, message?: string): ErrorResponse {
  return { error: createApiError(code, message) };
}

/** Map an error code to its documented HTTP status. */
export function statusForErrorCode(code: ErrorCode): number {
  return HTTP_STATUS_BY_CODE[code];
}

// ---------------------------------------------------------------------------
// Request validation
// ---------------------------------------------------------------------------

const DISCOVER_ALLOWED_KEYS = new Set(['mood', 'activity', 'favoriteArtists']);

/**
 * Validate and normalize a /api/discover request body into a DiscoveryContext.
 * Rejects out-of-enum mood/activity, more than MAX_FAVORITE_ARTISTS artists,
 * and unexpected top-level fields.
 */
export function validateDiscoverInput(body: unknown): ValidationResult<DiscoveryContext> {
  if (!isPlainObject(body)) {
    return { ok: false, error: createApiError('INVALID_INPUT', 'Request body must be an object.') };
  }

  for (const key of Object.keys(body)) {
    if (!DISCOVER_ALLOWED_KEYS.has(key)) {
      return {
        ok: false,
        error: createApiError('INVALID_INPUT', `Unexpected field: "${key}".`),
      };
    }
  }

  if (!isMood(body.mood)) {
    return { ok: false, error: createApiError('INVALID_INPUT', 'A valid mood is required.') };
  }

  if (!isActivity(body.activity)) {
    return { ok: false, error: createApiError('INVALID_INPUT', 'A valid activity is required.') };
  }

  if (body.favoriteArtists !== undefined && !Array.isArray(body.favoriteArtists)) {
    return {
      ok: false,
      error: createApiError('INVALID_INPUT', 'favoriteArtists must be an array of strings.'),
    };
  }

  const favoriteArtists = sanitizeFavoriteArtists(body.favoriteArtists);
  if (favoriteArtists.length > MAX_FAVORITE_ARTISTS) {
    return {
      ok: false,
      error: createApiError(
        'INVALID_INPUT',
        `A maximum of ${MAX_FAVORITE_ARTISTS} favorite artists is allowed.`,
      ),
    };
  }

  return {
    ok: true,
    value: { mood: body.mood, activity: body.activity, favoriteArtists },
  };
}

/**
 * Validate a /api/feedback request body. Reuses discover validation for the
 * context and verifies the candidate pool, id arrays, and feedback reasons.
 */
export function validateFeedbackInput(body: unknown): ValidationResult<FeedbackRequest> {
  if (!isPlainObject(body)) {
    return { ok: false, error: createApiError('INVALID_INPUT', 'Request body must be an object.') };
  }

  const contextResult = validateDiscoverInput(body.context);
  if (!contextResult.ok) {
    return contextResult;
  }

  if (!Array.isArray(body.candidatePool) || body.candidatePool.length === 0) {
    return {
      ok: false,
      error: createApiError('INVALID_INPUT', 'candidatePool must be a non-empty array.'),
    };
  }

  if (!isStringArray(body.shownTrackIds)) {
    return {
      ok: false,
      error: createApiError('INVALID_INPUT', 'shownTrackIds must be an array of strings.'),
    };
  }

  if (!isStringArray(body.skippedTrackIds)) {
    return {
      ok: false,
      error: createApiError('INVALID_INPUT', 'skippedTrackIds must be an array of strings.'),
    };
  }

  if (!Array.isArray(body.reasons) || !body.reasons.every(isFeedbackReason)) {
    return {
      ok: false,
      error: createApiError('INVALID_INPUT', 'reasons contains an unsupported value.'),
    };
  }

  return {
    ok: true,
    value: {
      context: {
        mood: contextResult.value.mood,
        activity: contextResult.value.activity,
        favoriteArtists: contextResult.value.favoriteArtists,
      },
      candidatePool: body.candidatePool as FeedbackRequest['candidatePool'],
      shownTrackIds: body.shownTrackIds,
      skippedTrackIds: body.skippedTrackIds,
      reasons: body.reasons,
    },
  };
}

/** Validate and sanitize the `q` query param for GET /api/spotify/search. */
export function validateSearchQuery(value: unknown): ValidationResult<string> {
  if (typeof value !== 'string') {
    return { ok: false, error: createApiError('INVALID_INPUT', 'Query parameter "q" is required.') };
  }
  return { ok: true, value: sanitizeArtistName(value) };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}
