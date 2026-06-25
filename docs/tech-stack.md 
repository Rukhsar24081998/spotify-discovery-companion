# Tech Stack

# Spotify Discovery Companion

## Overview

Spotify Discovery Companion is a full-stack AI-powered web application built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Groq API**, and the **Spotify Web API**.

The application is designed to be deployed on **Vercel**.

The architecture separates responsibilities clearly:

* **Frontend** → User interface and interactions
* **Backend** → API orchestration and business logic
* **Groq** → AI reasoning and recommendation explanations
* **Spotify Web API** → Music catalog, metadata, and 30-second previews

---

# Technology Stack

## Frontend

* Next.js 15 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* Lucide React (icons)

Purpose:

* Responsive UI
* Component-based architecture
* Server Actions / API Routes
* Optimized performance

---

## Backend

Use **Next.js API Routes**.

Responsibilities:

* Handle requests from the frontend
* Authenticate with Spotify
* Communicate with Groq
* Merge AI responses with Spotify metadata
* Return recommendation cards to the frontend

No separate backend server is required.

---

## AI Layer

Provider:

Groq API

Responsibilities:

* Understand user intent
* Generate discovery strategy
* Rank Spotify search results
* Generate recommendation explanations
* Refine recommendations using user feedback

The AI should **never generate fictional songs or artists**.

**Configuration:** Model `llama-3.3-70b-versatile`, `temperature` 0.3, JSON response format, two calls per discovery. See `ai-workflow.md` → *Groq Configuration* for the full specification and JSON validation rules.

---

## Music Provider

Spotify Web API

Endpoints:

### Search API

Search tracks using the discovery strategy.

Returns:

* Track ID
* Song title
* Artist
* Album artwork
* Preview URL
* Spotify URL

---

### Track Details API

Retrieve additional metadata if required.

---

Spotify remains the source of truth for all music content.

---

# High-Level Architecture

```text
                User
                  │
                  ▼
        Discovery Companion UI
                  │
                  ▼
          Next.js API Route
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    Groq API         Spotify Web API
        │                   │
        └─────────┬─────────┘
                  ▼
     Recommendation Composer
                  │
                  ▼
        Recommendation Cards
                  │
                  ▼
         Continue in Spotify
```

---

# Project Structure

```text
spotify-discovery-companion/

├── app/
│   ├── page.tsx
│   ├── discover/
│   ├── api/
│   │   ├── discover/
│   │   ├── spotify/
│   │   └── feedback/
│
├── components/
│   ├── DiscoveryCard.tsx
│   ├── MoodSelector.tsx
│   ├── ActivitySelector.tsx
│   ├── ArtistSearch.tsx
│   ├── LoadingState.tsx
│   ├── RecommendationCard.tsx
│   ├── PreviewPlayer.tsx
│   └── FeedbackDialog.tsx
│
├── lib/
│   ├── groq.ts
│   ├── spotify.ts
│   ├── prompts.ts
│   └── utils.ts
│
├── types/
│
├── docs/
│
├── public/
│
└── styles/
```

---

# Environment Variables

Create a `.env.local` file.

```env
GROQ_API_KEY=

SPOTIFY_CLIENT_ID=

SPOTIFY_CLIENT_SECRET=
```

Never expose API keys in frontend code.

All AI and Spotify requests must go through backend API routes.

---

# Data Flow

## Step 1

User selects:

* Mood
* Activity
* Optional artists

---

## Step 2

Frontend sends request:

```json
{
  "mood": "Energetic",
  "activity": "Workout",
  "favoriteArtists": [
    "Arijit Singh"
  ]
}
```

---

## Step 3

Backend calls Groq.

Groq returns:

* Discovery strategy
* Search intent

---

## Step 4

Backend queries Spotify Search API.

Retrieve:

Approximately 20 candidate songs.

---

## Step 5

Backend sends candidate songs back to Groq.

Groq:

* Ranks songs
* Generates explanations

---

## Step 6

Backend combines:

Spotify metadata

*

Groq output

↓

Returns recommendation cards.

---

## Step 7

Frontend renders:

* Artwork
* Song
* Artist
* Discovery Match
* Explanation
* Preview
* Save
* Continue in Spotify

---

# API Routes

All routes return JSON. All error responses share a common envelope:

```json
{
  "error": {
    "code": "SPOTIFY_UNAVAILABLE",
    "message": "Human-friendly message safe to display."
  }
}
```

Error codes: `INVALID_INPUT` (400), `SPOTIFY_AUTH_FAILED` (502), `SPOTIFY_UNAVAILABLE` (502/503), `GROQ_UNAVAILABLE` (502/503), `NO_RESULTS` (200 with empty list — not an error), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500).

---

## POST /api/discover

Generates a fresh set of recommendations.

**Input**

```json
{
  "mood": "Energetic",
  "activity": "Workout",
  "favoriteArtists": ["Arijit Singh"]
}
```

**Validation**

* `mood` — required, must be one of: `Happy`, `Calm`, `Focused`, `Energetic`, `Nostalgic`.
* `activity` — required, must be one of: `Workout`, `Studying`, `Working`, `Driving`, `Relaxing`.
* `favoriteArtists` — optional array, **max 3**, each a trimmed, sanitized string ≤ 80 chars. Extra entries are rejected with `INVALID_INPUT`.

**Output**

```json
{
  "recommendations": [ /* Recommendation[] (target 5, min 3) */ ],
  "candidatePool": [ /* full candidate set, replayed to /api/feedback */ ],
  "meta": {
    "limited": false,
    "returnedCount": 5
  }
}
```

* `meta.limited` is `true` when fewer than 3 recommendations could be produced after the broadened-search fallback.
* `candidatePool` lets the client maintain session state for feedback without a server-side store.

**Errors:** `INVALID_INPUT`, `SPOTIFY_AUTH_FAILED`, `SPOTIFY_UNAVAILABLE`, `GROQ_UNAVAILABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`.

---

## POST /api/feedback

Re-ranks the remaining candidate pool using session feedback. **No new Spotify search** unless the pool can no longer yield 3 recommendations.

**Input**

```json
{
  "context": {
    "mood": "Energetic",
    "activity": "Workout",
    "favoriteArtists": ["Arijit Singh"]
  },
  "candidatePool": [ /* tracks from /api/discover */ ],
  "shownTrackIds": ["id1", "id2"],
  "skippedTrackIds": ["id1", "id2"],
  "reasons": ["Too energetic", "Already know this artist"]
}
```

**Validation**

* `context` — required, same rules as `/api/discover`.
* `candidatePool` — required, non-empty array.
* `reasons` — each must be one of: `Too energetic`, `Wrong mood`, `Didn't like the vocals`, `Already know this artist`.

**Output**

Same shape as `/api/discover` (`recommendations`, `candidatePool`, `meta`), excluding already-shown and skipped tracks.

**Errors:** `INVALID_INPUT`, `GROQ_UNAVAILABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`.

---

## GET /api/spotify/search

Backs the optional artist autocomplete in `ArtistSearch`. Proxies Spotify artist search so the client never holds Spotify credentials.

**Input (query params)**

* `q` — required, the partial artist name (trimmed, sanitized, ≤ 80 chars).
* `type` — fixed to `artist` for the MVP.

**Output**

```json
{
  "artists": [
    { "id": "spotify-artist-id", "name": "Arijit Singh", "image": "https://..." }
  ]
}
```

**Behavior:** debounced on the client (≥ 250 ms). Returns up to 5 suggestions. Empty `q` returns an empty list (no Spotify call).

**Errors:** `INVALID_INPUT`, `SPOTIFY_UNAVAILABLE`, `RATE_LIMITED`.

---

# Recommendation Object

```ts
interface Recommendation {
  trackId: string;
  title: string;
  artist: string;
  albumArt: string;
  previewUrl: string | null; // null when Spotify provides no preview
  spotifyUrl: string;
  discoveryScore: number;     // integer 0–100, rendered as "Discovery Match"
  explanation: string;        // <= 3 sentences, no technical jargon
}
```

---

# Spotify API Edge Cases

The application must **gracefully degrade** in every case below. The preview feature is **never removed** — it is hidden only when a specific track has no preview.

## Missing `preview_url`

`preview_url` is frequently `null` for many tracks/regions, and access has tightened in recent Spotify API changes. This is the most likely real-world degradation.

* `previewUrl` is typed `string | null`.
* When `null`, the `RecommendationCard` **hides the preview player** and shows: `Preview unavailable — Continue in Spotify`. The primary "Continue in Spotify" action remains.
* The ranker may use preview availability as a **soft tie-breaker** (prefer candidates that have a preview) but must not exclude otherwise-strong matches solely for lacking one.
* **Implementation note:** Verify current Spotify API access for `preview_url` early — it directly affects a core documented feature and the Definition of Done ("previews when available").

## Empty Search Results

* If Spotify returns 0 tracks, the backend performs **one broadened search** (relax language/tempo, drop the most restrictive term).
* If still empty, return `recommendations: []` with `NO_RESULTS` semantics (HTTP 200). The frontend shows a friendly empty state with a "Try again / adjust mood" prompt. This is **not** treated as a crash.

## Rate Limits (HTTP 429)

* Respect the `Retry-After` header. Retry **once** after the indicated delay (capped at ~2s) for token/search.
* If still rate-limited, return `RATE_LIMITED` with a friendly "Spotify is busy, please try again in a moment" message.
* Token caching is the primary defense against hitting search limits.

## Authentication Failures

* Spotify uses **Client Credentials** flow (no user login). If token issuance fails, retry **once**; on repeated failure return `SPOTIFY_AUTH_FAILED`.
* Never leak credential details to the client — log server-side only.

## Unavailable / Region-Restricted Tracks

* Tracks without a usable `spotifyUrl` or marked unavailable are **filtered out** before ranking.
* If filtering drops the set below the minimum of 3, apply the broadened-search fallback.

---

# Performance Guidelines

* Cache Spotify access token in server memory until expiry (~3600s), with a 60s safety margin before refresh.
* Keep Groq prompts concise; send only the minimal candidate fields (id, title, artist, popularity) to the ranking call.
* Use exactly two Groq calls per discovery (planning + ranking); never split planning into multiple calls.
* Lazy-load album artwork.
* Use the step-by-step `LoadingState` screen to mask perceived latency for AI responses.
* Avoid blocking the UI during network requests.
* Reuse the cached candidate pool for feedback re-ranking (no extra Spotify search unless the pool is exhausted).

---

# Latency Budget & Bottlenecks

Estimated latency for a single `/api/discover` request (warm token):

| Stage | Typical | Notes |
| --- | --- | --- |
| **Spotify token** | ~0 ms cached / 150–300 ms cold | Cached in memory until expiry. |
| **Groq Call 1 (planning)** | 400–900 ms | Small output, larger model. |
| **Spotify Search** | 200–500 ms | Single search request, ~20 results. |
| **Groq Call 2 (ranking)** | 700–1500 ms | Dominant cost; scores + explanations for ~20 tracks. |
| **Backend orchestration** | 50–100 ms | Validation, composition, JSON parsing. |
| **Frontend render** | ~50 ms | Card rendering, lazy images. |
| **End-to-end** | **~1.5–3.3 s** | Sequential critical path. |

**Primary bottleneck:** the two **sequential** Groq calls (they cannot be parallelized because ranking depends on the search results, which depend on the planning output).

**Mitigations (no UX change):**

* Token caching removes the cold-start cost on all but the first request.
* The `LoadingState` reasoning screen makes the wait feel intentional rather than slow.
* Keep `max_tokens` bounded and prompts concise to shorten Call 2.
* `/api/feedback` is faster (~0.8–1.7 s): one Groq call, no Spotify search.

---

# Security

* **API key protection:** `GROQ_API_KEY`, `SPOTIFY_CLIENT_ID`, and `SPOTIFY_CLIENT_SECRET` are read **server-side only** (never prefixed `NEXT_PUBLIC_`).
* **Secret management:** Secrets live in `.env.local` locally and in Vercel Environment Variables in production. No secrets in the repository (`.env.local` is git-ignored).
* **Server-only AI calls:** Groq and Spotify are called exclusively from Next.js API routes. The browser never calls them directly.
* **Spotify authentication:** Client Credentials flow; the token is obtained and cached on the server only.
* **Input sanitization:** Validate `mood`/`activity` against fixed enums; trim and length-cap artist names (≤ 80 chars, max 3); reject unexpected fields. Treat all user input as untrusted before it reaches a prompt or a Spotify query.
* **Prompt-injection hygiene:** User-provided artist text is inserted into prompts as data, not instructions; the system prompt instructs the model to ignore embedded instructions in user fields.
* **Error handling:** Catch and map all upstream failures to the standard error envelope; show friendly UI, never stack traces.
* **Logging:** Log errors server-side only; never log secrets or full tokens.

---

# Scalability

The MVP is designed to scale on Vercel serverless without changing the product experience:

* **Stateless backend:** No database or server session. Session state (candidate pool, shown/skipped, skip count) is held client-side and replayed to `/api/feedback`, so any serverless instance can handle any request.
* **Reusable services:** All upstream access goes through `lib/spotify.ts` and `lib/groq.ts`. Routes orchestrate; services encapsulate I/O. Prompts live in `lib/prompts.ts`, isolated from logic.
* **Separation of concerns:** Frontend (UI/state) → API routes (orchestration) → services (I/O) → providers (Groq/Spotify). Each layer is independently testable and replaceable.
* **Modular components:** One responsibility per component (see `components/`), ≤ 300 lines each, composed rather than duplicated.
* **Shared types:** A single `types/` module defines `Recommendation`, request/response shapes, and enums used by both client and server to prevent drift.
* **Token caching** reduces Spotify load linearly with traffic; the candidate-pool reuse in feedback avoids redundant searches.

---

# Deployment

Platform:

Vercel

Deployment checklist:

* Environment variables configured
* Production build passes
* Spotify credentials verified
* Groq API key configured
* Preview URLs tested
* Mobile responsiveness verified

---

# Future Enhancements

The MVP intentionally excludes the following features:

* User authentication
* Playlist generation
* Voice interaction
* Chat interface
* Personalized listening history
* Social sharing
* Cross-session learning

These can be explored after validating the core discovery experience.

---

# Definition of Done

The technical implementation is complete when:

* The application runs locally.
* Users can submit mood, activity, and optional artists.
* Groq generates a discovery strategy.
* Spotify returns real tracks.
* Groq ranks and explains recommendations.
* Users can play real 30-second previews (when available).
* Users can continue listening in Spotify.
* The application is successfully deployed on Vercel.

The implementation should demonstrate a clear separation between AI reasoning and Spotify's recommendation infrastructure while delivering a seamless, production-ready MVP.
