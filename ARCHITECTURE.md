# Architecture (as-built)

> Navigational + as-built decisions for the Spotify Discovery Companion.
> The single source of truth is the frozen `/docs` folder; this document links
> to it rather than duplicating it. **Drafted in Phase 07, finalized in Phase 08.**

## Source of truth

- Product & journey: [`docs/problem-statement.md`](docs/problem-statement.md), [`docs/implementation-plan.md`](docs/implementation-plan.md)
- AI pipeline & scoring: [`docs/ai-workflow.md`](docs/ai-workflow.md)
- UI: [`docs/ui-guidelines.md`](docs/ui-guidelines.md)
- Tech, contracts, edge cases: [`docs/tech-stack.md`](docs/tech-stack.md)
- Engineering conventions: [`docs/cursor-rules.md`](docs/cursor-rules.md)
- Phase plan & status: [`phase-wise-implementation-plan/`](phase-wise-implementation-plan/)

## Layered design

```
Frontend (UI + client-held session state)
        ↓
Next.js API Routes (orchestration only)
        ↓
Services (I/O):  lib/groq.ts   lib/spotify.ts
        ↓
Providers:       Groq API      Spotify Web API
```

**Rule:** routes orchestrate; services encapsulate I/O; shared contracts live in
`types/`; prompts are isolated in `lib/prompts.ts`. Business logic and secrets
never reach the browser (`docs/cursor-rules.md` → Architecture, `docs/tech-stack.md` → Security).

## Modules

| Module | Responsibility |
| --- | --- |
| `types/index.ts` | Single source of truth for shared contracts (Recommendation, route I/O, error envelope, `Mood`/`Activity`). |
| `lib/utils.ts` | Validation, sanitization, score clamp/round, error-envelope builders. |
| `lib/spotify.ts` | Client-Credentials auth + in-memory token cache, track/artist search, mapping to `CandidateTrack`/`ArtistSuggestion`. `SpotifyError`. |
| `lib/groq.ts` | Groq Call 1 (`generatePlan`) and Call 2 (`rankCandidates`). `GroqError`. |
| `lib/prompts.ts` | Versioned prompt builders (`buildPlanningPromptV1`, `buildRankingPromptV1`). |
| `lib/ranking.ts` | Server-side post-processing: `trackId` reconciliation, variety enforcement, `Recommendation` composition. |
| `lib/log.ts` | Dev-only logging (silent in production). |

## Request pipeline — `POST /api/discover`

```
Discovery Request
  → validate input            (lib/utils.validateDiscoverInput)
  → planning (Groq Call 1)    (lib/groq.generatePlan)   — once per request, internal only
  → Spotify candidate search  (lib/spotify.searchTracks)
  → pre-search broadened search if pool < min
  → candidate pool (deduped by trackId)
  → ranking (Groq Call 2)       (lib/groq.rankCandidates)
  → reconcile trackIds          (lib/ranking.reconcileRanking)
  → compose Recommendations     (lib/ranking.composeRecommendations)
  → post-ranking broadened search + re-rank if still < min
  → response { recommendations, candidatePool, meta }
```

- **PlanningResult** (`intent`, `strategy`, `searchQuery`) is generated once and
  kept server-internal; it is passed to Call 2 but never exposed in the API response.
- **Discovery Match** (`discoveryScore`) is an integer 0–100 returned by Groq Call 2,
  clamped/rounded server-side. The ranking prompt optimizes for product principles
  (mood/activity fit, familiarity/discovery balance, set diversity) rather than
  rigid numeric weight formulas.
- **Popularity** is omitted from the ranking prompt when zero/unavailable; it is
  not used as a primary ranking signal until Spotify mapping is confirmed reliable.
- **Explanations** are ≤3 sentences, context-aware, and validated before use.
- **Variety** is enforced at set level: the AI curates a cohesive set; the backend
  defensively discards unknown `trackId`s and enforces one track per primary artist.

## Two-call Groq flow

1. **Call 1 — Planning:** `{ mood, activity, favoriteArtists }` → `{ intent, strategy, searchQuery }`.
2. **Spotify Search** runs between the two Groq calls.
3. **Call 2 — Ranking:** scores + explanations over the candidate pool using context + intent + strategy.

See [`docs/ai-workflow.md`](docs/ai-workflow.md) → Complete AI Pipeline.

## Error conventions

All routes return the shared envelope `{ error: { code, message } }` with codes
and HTTP statuses from `lib/utils` (`createErrorResponse`, `statusForErrorCode`).
`NO_RESULTS` is **HTTP 200** with an empty list, not an error. Upstream failures
are surfaced via `SpotifyError` / `GroqError` carrying an `ErrorCode`.

## Stateless, client-held session

No database or server session. The backend returns `candidatePool` so the client
can replay it to `/api/feedback` (Phase 11). Any serverless instance can serve any
request (`docs/tech-stack.md` → Scalability).

## Configuration

Server-only env (never `NEXT_PUBLIC_`): `GROQ_API_KEY`, `SPOTIFY_CLIENT_ID`,
`SPOTIFY_CLIENT_SECRET`, optional `SPOTIFY_MARKET` (omitted when unset).

## Development utilities

- `npm run measure:preview` — measures Spotify `preview_url` availability.
- `npm run measure:plan` — validates Groq planning output, JSON validity, latency.

Both are dev-only, excluded from the app build, and never imported by the app.
