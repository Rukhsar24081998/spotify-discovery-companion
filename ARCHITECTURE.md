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
| `lib/groq.ts` | Groq Call 1 (`generatePlan`); Call 2 ranking arrives in Phase 08. `GroqError`. |
| `lib/prompts.ts` | Versioned prompt builders (`buildPlanningPromptV1`), separate from logic. |
| `lib/ranking.ts` | **Temporary** deterministic ranking stub (Phase 07); replaced by AI ranking in Phase 08. |
| `lib/log.ts` | Dev-only logging (silent in production). |

## Request pipeline — `POST /api/discover` (Phase 07)

```
Discovery Request
  → validate input            (lib/utils.validateDiscoverInput)
  → planning (Groq Call 1)    (lib/groq.generatePlan)   — once per request
  → Spotify candidate search  (lib/spotify.searchTracks)
  → broadened search if <3    (deterministic, no extra Groq call)
  → candidate pool (deduped by trackId)
  → ranking stub (ordered CandidateTrack[])  (lib/ranking.rankCandidatesStub)
  → response { rankedCandidates, candidatePool, meta }
```

- Planning runs **exactly once** per request; `intent`/`strategy` are carried for Phase 08 ranking.
- The stub orders by popularity and enforces the one-per-artist variety rule. It
  produces **no** Discovery Scores or explanations — those are AI concepts that
  first appear in Phase 08, which returns the final `DiscoverResponse`
  (`Recommendation[]`).

## Two-call Groq flow

1. **Call 1 — Planning** (Phase 06, live): `{ mood, activity, favoriteArtists }` → `{ intent, strategy, searchQuery }`.
2. **Spotify Search** runs between the two Groq calls.
3. **Call 2 — Ranking** (Phase 08): scores + explanations over the candidate pool. Currently a deterministic stub.

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
