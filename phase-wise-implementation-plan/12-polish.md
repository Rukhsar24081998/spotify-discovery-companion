# Phase 12 — Polish (Edge Cases, Accessibility, Responsiveness)

**Reference docs:** `ui-guidelines.md` (Edge & Empty States, Motion, Responsiveness, Accessibility, UI Success Criteria), `tech-stack.md` (Spotify API Edge Cases, Security, Performance), `cursor-rules.md` (Error Handling, Accessibility, Performance, Code Quality).

---

## Objective

Harden the complete experience against every documented edge case and meet the non-functional requirements: graceful empty/error states, full accessibility, responsiveness, motion polish, and consistent error handling across all routes.

## Scope

- In: limited/no-results/service-error UIs, a11y pass, responsive pass, motion polish, error-envelope consistency, final performance checks.
- Out: any new features or scope changes.

## Deliverables

- A production-quality, accessible, responsive app that never crashes or exposes technical errors.

## Files to create or modify

- Cross-cutting refinements across `app/discover/page.tsx`, all `components/`, and all API routes (`discover`, `feedback`, `spotify/search`).

## Components involved

- All components (final polish pass).

## Backend work

- Verify every route returns the standard error envelope; confirm input validation and server-only logging everywhere.

## APIs

- Failure-path coverage for Spotify and Groq.

## AI integrations

- Ensure AI failures degrade gracefully without blocking the UI.

## Dependencies

- Phases 02–11.

## Implementation notes

- Empty/edge UIs per `ui-guidelines.md`:
  - Limited results (1–2): show available cards + calm "we found a few matches" notice.
  - No results: friendly empty state with "Adjust mood & activity" / "Try again".
  - Service errors: friendly "something went wrong, try again" — never stack traces.
- Accessibility: keyboard navigation throughout, visible focus states, sufficient contrast, semantic HTML, alt text on artwork, accessible labels.
- Responsiveness: desktop primary, tablet supported, mobile single-column with accessible touch targets.
- Motion: subtle fades, hover elevation, progress indicators only; avoid large transitions/flashing; respect reduced-motion.
- Performance: lazy-load images, minimize re-renders, confirm token caching and candidate-pool reuse.
- Security sweep: no secrets client-side, inputs sanitized, errors logged server-only.

## Edge cases

- All Spotify edge cases (missing preview, empty, 429, auth fail, unavailable tracks) surface friendly UI.
- Groq unavailable / invalid output → friendly error, existing results preserved where possible.
- Slow network → `LoadingState` remains coherent; no UI lock-up.
- Mid-flow navigation and back-button behavior are sane.

## Testing checklist

- [ ] All empty/edge/error states match `ui-guidelines.md`; no crashes or raw errors.
- [ ] Full keyboard navigation; focus states; contrast; semantic HTML; alt text.
- [ ] Verified on desktop, tablet, mobile.
- [ ] Subtle animations only; reduced-motion honored.
- [ ] No secrets reach the client; inputs sanitized; server-only logs.
- [ ] Performance: images lazy-load; no obvious re-render storms.

## Definition of Done

The app degrades gracefully in every documented scenario and meets the documented accessibility, responsiveness, performance, and security bars — matching the UI Success Criteria.

## Risks

- **Medium.** Risk is missing a degradation path. Mitigation: drive this phase directly from the documented edge-case lists as an explicit checklist; optionally run a security/Bugbot review.
