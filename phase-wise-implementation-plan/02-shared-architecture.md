# Phase 02 — Shared Architecture

**Reference docs:** `tech-stack.md` (Recommendation Object, API Routes, Data Flow, Security), `ai-workflow.md` (Responsibility Matrix, Expected AI Output), `cursor-rules.md` (Canonical Terminology, Code Quality, Naming Conventions).

---

## Objective

Build the reusable, dependency-free core — shared types, validation/sanitization utilities, and service skeletons — that every later phase imports, eliminating type drift and duplicated logic.

## Scope

- In: `types/` contracts, `lib/utils.ts`, and typed signatures (stubs) for `lib/spotify.ts`, `lib/groq.ts`, `lib/prompts.ts`.
- Out: any live API/AI calls (implemented in 05/06/08), any UI.

## Deliverables

- A single source of truth for all data contracts shared by client and server.
- Tested validation + sanitization helpers.
- Service skeletons with final function signatures so later phases fill in bodies without changing call sites.

## Files to create or modify

- `types/index.ts` (or split files) — `Recommendation`, request/response types for all three routes, the standard error envelope + error code union, `Mood` and `Activity` enums.
- `lib/utils.ts` — input validation, sanitization, score clamp/round, error-envelope builders.
- `lib/spotify.ts`, `lib/groq.ts`, `lib/prompts.ts` — exported function signatures only (stubbed bodies).

## Components involved

- None.

## Backend work

- Validation + sanitization helpers that API routes will reuse (single implementation, no duplication).

## APIs

- None (contract types only).

## AI integrations

- None (define the AI output type from `ai-workflow.md` → Expected AI Output).

## Dependencies

- Phase 01. No new packages (optionally a tiny schema validator if preferred, but native guards are acceptable).

## Implementation notes

- Canonical enums (from `cursor-rules.md`):
  - `Mood`: Happy, Calm, Focused, Energetic, Nostalgic.
  - `Activity`: Workout, Studying, Working, Driving, Relaxing.
- `Recommendation` matches `tech-stack.md` exactly: `trackId`, `title`, `artist`, `albumArt`, `previewUrl: string | null`, `spotifyUrl`, `discoveryScore` (int 0–100), `explanation`.
- Define request/response types for `POST /api/discover`, `POST /api/feedback`, `GET /api/spotify/search`, plus the shared error envelope with codes: `INVALID_INPUT`, `SPOTIFY_AUTH_FAILED`, `SPOTIFY_UNAVAILABLE`, `GROQ_UNAVAILABLE`, `NO_RESULTS`, `RATE_LIMITED`, `INTERNAL_ERROR`.
- Sanitization: trim artist names, cap length ≤ 80, enforce max 3, reject unexpected fields.
- Score helper: clamp to 0–100 and round to integer.
- Naming: Types PascalCase, functions/vars camelCase, constants UPPER_SNAKE_CASE.

## Edge cases

- Empty/whitespace artist names → dropped after trim.
- More than 3 artists → `INVALID_INPUT`.
- Out-of-enum mood/activity → `INVALID_INPUT`.
- Score values <0, >100, or non-integer → normalized by the helper.

## Testing checklist

- [ ] Unit tests: valid + invalid mood/activity.
- [ ] Unit tests: artist array trimming, length cap, max-3 enforcement, empty-string drop.
- [ ] Unit tests: score clamp/round across boundary values.
- [ ] Types compile when imported from both a client component and a server route.
- [ ] Error-envelope builder produces the documented shape for each code.

## Definition of Done

All shared types and utilities exist, are unit-tested, and are importable by both frontend and backend; service files expose final signatures that later phases implement without changing call sites.

## Risks

- **Low–Medium.** Risk is under-specifying a contract and needing a later change — mitigated by deriving every type directly from `tech-stack.md`/`ai-workflow.md` before coding.
