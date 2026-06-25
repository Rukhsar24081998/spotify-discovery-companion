# Phase 04 — Discovery Flow UI

**Reference docs:** `implementation-plan.md` (Steps 2–3), `ui-guidelines.md` (Screen 2, Selection Components, Artist Search, AI Processing Screen), `ai-workflow.md` (input shape), `cursor-rules.md` (Component Rules).

---

## Objective

Build the Discovery Companion input screen (Screen 2) and the AI processing screen (Screen 3, `LoadingState`) with full client-side state — fully functional against mocks so it does not block on the backend.

## Scope

- In: `/discover` route, `MoodSelector`, `ActivitySelector`, `ArtistSearch` (mocked suggestions), `LoadingState`, flow state container, CTA gating.
- Out: real Spotify artist autocomplete (Phase 05), real recommendations (Phase 09).

## Deliverables

- A complete, navigable input screen that assembles a valid `/api/discover` request payload.
- The reasoning-style `LoadingState` screen wired to mock timing.

## Files to create or modify

- `app/discover/page.tsx` (+ flow state container/hook).
- `components/MoodSelector.tsx`, `components/ActivitySelector.tsx`, `components/ArtistSearch.tsx`, `components/LoadingState.tsx`.

## Components involved

- `MoodSelector`, `ActivitySelector`, `ArtistSearch`, `LoadingState`.

## Backend work

- None (artist suggestions mocked behind the `lib/spotify.ts` signature).

## APIs

- Consumes the `GET /api/spotify/search` **contract** via a mock; real wiring in Phase 05.

## AI integrations

- None directly; assembles the `{ mood, activity, favoriteArtists }` payload defined in `ai-workflow.md`.

## Dependencies

- Phases 01–03 (uses pill/card primitives).

## Implementation notes

- Mood (required, single-select): Happy, Calm, Focused, Energetic, Nostalgic.
- Activity (required, single-select): Workout, Studying, Working, Driving, Relaxing.
- Artist search: optional autocomplete, **max 3**, debounced (≥ 250 ms), suggestions mocked for now.
- CTA "Discover Music" disabled until mood **and** activity are selected.
- `LoadingState` (Screen 3): step list that checks off — Understanding your mood → activity → Building a discovery strategy → Searching Spotify → Ranking recommendations → Preparing your discovery. No spinner; subtle fades; accessible live region.
- Keep flow state local to the discovery flow (mood, activity, artists, plus placeholders for candidatePool/shown/skipped/skipCount used in later phases).

## Edge cases

- Deselect/reselect of pills; only one selection per group.
- Attempting >3 artists is blocked at input.
- LoadingState must be able to transition to an error state (used once `/api/discover` exists).
- Reduced-motion: steps still progress without animation.

## Testing checklist

- [ ] Single-select enforced for mood and activity; canonical order.
- [ ] CTA disabled until both required fields chosen.
- [ ] Artist search caps at 3, is debounced, optional, removable chips.
- [ ] Payload assembled matches the `/api/discover` input contract.
- [ ] `LoadingState` steps render progressively; no spinner.
- [ ] Keyboard accessible; visible focus; responsive layouts.

## Definition of Done

A user can complete the entire input screen and the flow produces a valid `/api/discover` payload (against mock data), and the `LoadingState` screen renders the documented reasoning steps.

## Risks

- **Medium.** Risk is the mock contract diverging from the real one — mitigated by importing the same `types/` used by the backend so wiring in Phase 05 is a swap, not a rewrite.
