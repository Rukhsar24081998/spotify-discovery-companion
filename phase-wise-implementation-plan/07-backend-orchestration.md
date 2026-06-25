# Phase 07 — Backend Orchestration

**Reference docs:** `tech-stack.md` (Data Flow, API Routes `POST /api/discover`, Latency Budget, Security), `ai-workflow.md` (Complete AI Pipeline, Responsibility Matrix), `cursor-rules.md` (Architecture, API Rules, Error Handling).

---

## Objective

Wire the `POST /api/discover` route end-to-end — input validation → Groq planning → Spotify search → candidate-pool assembly → response composition — using a **deterministic ranking stub** so the entire request path is testable before AI ranking exists.

## Scope

- In: `app/api/discover/route.ts`, orchestration logic, error envelope, response shape, candidate pool assembly, a temporary popularity-based ranking stub.
- Out: real AI ranking, Discovery Match scoring, and explanations (Phase 08); UI rendering (Phase 09).

## Deliverables

- A working `/api/discover` endpoint returning real Spotify tracks shaped as `Recommendation[]`, ranked by the stub, with `candidatePool` and `meta`.
- **Draft `ARCHITECTURE.md`** (repo root) — created here because by end of Phase 07 the full request path and key seams are real and stable (service boundaries, route-orchestrates pattern, two-call Groq flow, stateless client-held session, error-envelope conventions). Keep it as a navigational + as-built-decisions doc that links out to `/docs` rather than duplicating it. Finalized in Phase 08.

## Files to create or modify

- `app/api/discover/route.ts` — handler + orchestration.
- `lib/utils.ts` — extend with any shared composition helpers if needed.
- (Consumes `lib/spotify.ts` and `lib/groq.ts` from Phases 05–06.)

## Components involved

- None directly (consumed by Phase 09).

## Backend work

- Validate input (`mood`, `activity` enums; `favoriteArtists` ≤ 3, sanitized; reject extra fields).
- Call `generatePlan` (Groq Call 1) → get `searchQuery` + `intent` + `strategy`.
- Call Spotify `searchTracks` with the query → ~20 candidates.
- Assemble `candidatePool`; apply the **ranking stub** (sort by popularity, apply variety rule of one-per-artist) to select target 5 / min 3.
- Compose response: `{ recommendations, candidatePool, meta }` with `meta.limited` flag.
- Map all upstream failures to the standard error envelope.

## APIs

- Spotify Search (via `lib/spotify.ts`).

## AI integrations

- Groq Call 1 only (planning). Ranking remains a stub until Phase 08.

## Dependencies

- Phases 05 (Spotify) + 06 (Groq planning).

## Implementation notes

- The stub exists purely to make the path testable and to isolate AI risk; it carries placeholder `discoveryScore` and a generic `explanation` to be replaced in Phase 08.
- Keep orchestration thin: routes orchestrate, services do I/O (`cursor-rules.md` → Architecture).
- Return `candidatePool` so the client can later replay it to `/api/feedback` (stateless backend).
- Respect the latency budget; reuse cached Spotify token.
- Business logic stays in the route/services, never in the browser; no secrets client-side.

## Edge cases

- **<3 candidates after search:** trigger one broadened search (relax language/tempo, drop most restrictive term), then re-assemble.
- **Still <3:** return what exists with `meta.limited = true`.
- **Zero candidates:** return `recommendations: []` with `NO_RESULTS` semantics (HTTP 200).
- **Groq or Spotify unavailable:** return the matching error code.
- **Invalid input:** `INVALID_INPUT` (400).

## Testing checklist

- [ ] Valid request returns 3–5 stub recommendations with full `Recommendation` fields.
- [ ] `candidatePool` and `meta` present and correctly shaped.
- [ ] Broadened-search fallback triggers at <3; `meta.limited` set when still short.
- [ ] Empty results return `NO_RESULTS` semantics, not an error.
- [ ] Invalid input + upstream failures return correct envelopes.
- [ ] End-to-end latency within budget (excluding ranking).

## Definition of Done

`/api/discover` returns real Spotify candidates shaped as `Recommendation[]` via the stub, with correct response structure, fallback behavior, and error handling — fully testable without AI ranking.

## Risks

- **Medium.** Risk is leaking ranking concerns into orchestration. Mitigation: keep the stub isolated behind a clear seam so Phase 08 swaps it cleanly.
