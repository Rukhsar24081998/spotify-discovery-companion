# Phase 09 — Recommendation Cards

**Reference docs:** `implementation-plan.md` (Step 4), `ui-guidelines.md` (Recommendation Cards, Discovery Match, AI Explanation, Action Buttons), `tech-stack.md` (Recommendation Object), `cursor-rules.md` (Component Rules, Accessibility).

---

## Objective

Render the recommendations screen (Screen 4): cards showing artwork, title, artist, Discovery Match, AI explanation, and the action hierarchy — wired to the live `/api/discover` and the `LoadingState` screen.

## Scope

- In: `RecommendationCard`, results rendering, Save/Skip/Continue actions, wiring to `/api/discover`, `LoadingState` integration, skip-count tracking.
- Out: the preview player (Phase 10), feedback dialog (Phase 11).

## Deliverables

- A complete results screen that completes the journey to "Continue in Spotify" using real recommendations.

## Files to create or modify

- `components/RecommendationCard.tsx`
- `app/discover/page.tsx` — call `/api/discover`, manage results + shown/skipped + skipCount, render `LoadingState` during the request.

## Components involved

- `RecommendationCard`, `LoadingState` (wiring).

## Backend work

- None (consumes `/api/discover` from Phase 08).

## APIs

- Uses `spotifyUrl` (Continue in Spotify) and metadata from `/api/discover`.

## AI integrations

- Renders Groq-produced `discoveryScore` and `explanation`.

## Dependencies

- Phase 08 (ideal) or Phase 07 stub (minimum), Phase 04 (`LoadingState`), Phase 03 (primitives).

## Implementation notes

- Card layout per `ui-guidelines.md`: artwork → title → artist → `NN% Discovery Match` → explanation (≤ 3 lines) → (preview placeholder for Phase 10) → actions.
- Action hierarchy: Primary "Continue in Spotify", Secondary "Save", Tertiary "Skip" — visually reflect this order.
- Album artwork lazy-loaded with alt text.
- Skip increments a session skip counter (feeds Phase 11's threshold of 2).
- Leave a clearly marked slot for `PreviewPlayer` so Phase 10 drops in without restructuring.
- Display `discoveryScore` as a percentage labeled "Discovery Match"; never expose dimension weights.

## Edge cases

- `meta.limited` → render available cards plus the "limited results" notice (full styling in Phase 12).
- Empty results → empty state (full styling in Phase 12).
- Long titles/artist names truncate gracefully.
- Missing artwork → placeholder image with alt text.

## Testing checklist

- [ ] Cards render all fields with correct hierarchy and styling.
- [ ] "Continue in Spotify" opens the correct track URL.
- [ ] Save and Skip update session state; skip count increments.
- [ ] `LoadingState` shows during the request, then results render.
- [ ] Error/empty paths handled (placeholder UI acceptable until Phase 12).
- [ ] Responsive: cards stack on mobile; accessible markup + alt text.

## Definition of Done

A user completes the documented journey from input to "Continue in Spotify" using real recommendations, with the preview slot reserved for Phase 10.

## Risks

- **Medium.** Risk is coupling card layout to preview/feedback concerns. Mitigation: keep `RecommendationCard` presentational and prop-driven; reserve clean slots for later phases.
