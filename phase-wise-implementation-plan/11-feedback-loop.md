# Phase 11 — Feedback Loop

**Reference docs:** `ai-workflow.md` (Feedback Loop — trigger, reason→adjustment table, session state, re-ranking cost), `implementation-plan.md` (Step 5), `ui-guidelines.md` (Feedback Dialog), `tech-stack.md` (`POST /api/feedback`).

---

## Objective

Implement session-based recommendation refinement: after 2 skips, show an optional feedback dialog and re-rank the remaining cached candidates via `POST /api/feedback` — with a stateless backend and client-held session state.

## Scope

- In: `FeedbackDialog`, `/api/feedback` route, Groq re-rank call, client session-state replay, exclusion of shown/skipped tracks.
- Out: net-new product features; no persistence/auth (out of MVP).

## Deliverables

- A working feedback refinement that updates the remaining recommendations in-session without a new Spotify search (unless the pool is exhausted).

## Files to create or modify

- `components/FeedbackDialog.tsx`
- `app/api/feedback/route.ts`
- `lib/groq.ts` / `lib/prompts.ts` — re-rank function + prompt with reason adjustments.
- `app/discover/page.tsx` — skip-count trigger, replay session state to `/api/feedback`.

## Components involved

- `FeedbackDialog`, `RecommendationCard` (re-rendered with updated results).

## Backend work

- `/api/feedback`: validate `context`, `candidatePool`, `shownTrackIds`, `skippedTrackIds`, `reasons` (enum); re-rank remaining candidates via Groq; exclude shown/skipped; return the same shape as `/api/discover`.
- No new Spotify search unless the pool can no longer yield 3 → then one broadened search.

## APIs

- Spotify only on the exhaustion fallback.

## AI integrations

- Groq re-rank call (Call 3) applying the documented reason→adjustment mapping.

## Dependencies

- Phase 08 (ranking engine), Phase 09 (cards), Phase 10 (preview, optional).

## Implementation notes

- Trigger: after the user skips **2** recommendations in the session; dialog shown once per cycle; always optional/dismissible.
- Reason options: Too energetic / Wrong mood / Didn't like the vocals / Already know this artist — each maps to a deterministic ranking adjustment per `ai-workflow.md`.
- Session state is **client-held** (stateless backend): `context`, `candidatePool`, `shownTrackIds`, `skippedTrackIds` + reasons, `skipCount`. The client replays it to `/api/feedback`.
- Re-rank operates on the remaining pool only; returns a fresh top set excluding shown/skipped.
- This preserves horizontal scalability on Vercel (no server session).

## Edge cases

- Pool exhausted (can't reach 3) → one broadened search, then re-rank.
- User dismisses the dialog → no change; flow continues.
- Repeated cycles: dialog reappears after 2 more skips.
- Invalid/empty `candidatePool` → `INVALID_INPUT`.
- Groq unavailable → `GROQ_UNAVAILABLE`, keep existing recommendations visible.

## Testing checklist

- [ ] Dialog appears after exactly 2 skips; optional and dismissible.
- [ ] Each reason measurably changes ranking of the remaining pool.
- [ ] Already-shown/skipped tracks excluded from new results.
- [ ] No new Spotify search unless the pool is exhausted.
- [ ] Re-rank latency faster than discover (~0.8–1.7 s).
- [ ] Backend holds no session state between requests.

## Definition of Done

After 2 skips, the optional feedback dialog refines the remaining recommendations in-session per the documented reason adjustments, with a stateless backend and correct exclusion of shown/skipped tracks.

## Risks

- **Medium–High.** Risk is session-state drift between client and server contract, and re-rank quality. Mitigation: shared `types/`, deterministic reason mapping, reuse of the validated Phase 08 engine.
