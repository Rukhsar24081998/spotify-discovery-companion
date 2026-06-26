# Progress Checklist

Live tracker for the Spotify Discovery Companion build. Tick each phase only when its **Definition of Done** (in the phase document) is fully met and the phase has passed review.

**Overall completion: 92% (12 / 13 phases complete)**

> Update rule: each completed phase = ~7.7%. Recompute `completed / 13` after every merge.

---

## Phases

- [x] **01 — Project Setup** — Deployable Next.js 15 + TS + Tailwind skeleton
- [x] **02 — Shared Architecture** — `types/`, `lib/` service skeletons, utilities
- [x] **03 — Design System** — Theme tokens, primitives, Spotify Home + Discovery card
- [x] **04 — Discovery Flow UI** — Input screen + LoadingState (mocked)
- [x] **05 — Spotify API** — Token cache, Search, `/api/spotify/search`
- [x] **06 — Groq Planning** — Groq Call 1 (intent → strategy → query)
- [x] **07 — Backend Orchestration** — `/api/discover` with ranking stub
- [x] **08 — AI Recommendation Engine** — Groq Call 2: ranking + Discovery Match + explanations
- [x] **09 — Recommendation Cards** — Results screen + actions, wired to `/api/discover`
- [x] **10 — Preview Player** — Inline 30-sec preview + unavailable degradation
- [x] **11 — Feedback Loop** — FeedbackDialog + `/api/feedback`
- [x] **12 — Polish** — Edge/empty/error states, a11y, responsiveness
- [ ] **13 — Deployment** — Vercel production deploy + verification

---

## Per-Phase Sub-Checklists

### 01 — Project Setup
- [x] Toolchain installed (Next 15, React 19, TS, Tailwind, lucide-react)
- [x] `npm run dev` serves a dark-themed page
- [x] `npm run build` passes (strict TS, no `any`)
- [x] Folder skeleton + route placeholders created
- [x] `.env.example` + git-ignored `.env.local`

### 02 — Shared Architecture
- [x] `types/` contracts (Recommendation, route I/O, error envelope, enums)
- [x] `lib/utils.ts` validation + sanitization + score helpers
- [x] `lib/` service signatures stubbed
- [ ] Unit tests for validators pass — deferred this phase (verified via `npm run build` + `npm run lint`; no test framework per instruction)

### 03 — Design System
- [x] Theme tokens (near-black bg, dark-gray cards, Spotify green accent)
- [x] Primitives (pill button, card shell, headings, icon button) built
- [x] Spotify Home renders with Discovery card
- [x] "Discover" navigates to `/discover`
- [x] Responsive + accessible

### 04 — Discovery Flow UI
- [x] MoodSelector (single-select, canonical order)
- [x] ActivitySelector (single-select, canonical order)
- [x] ArtistSearch (max 3, debounced, mocked suggestions)
- [x] LoadingState reasoning screen
- [x] CTA gating + flow state container

### 05 — Spotify API
- [x] Token fetch + in-memory cache w/ margin
- [x] Search returns ~20 mapped candidates (paged in 10s; dev-mode `limit` cap)
- [x] `/api/spotify/search` live; ArtistSearch wired
- [x] preview_url availability measured (100% in IN-default sample)
- [x] 429 / empty / auth-fail handled

### 06 — Groq Planning
- [x] `lib/groq.ts` planning call (model + temp + JSON mode)
- [x] `lib/prompts.ts` planning prompt (`buildPlanningPromptV1`)
- [x] Schema validation + retry-once (+ fallback model)
- [x] Returns valid `{ intent, strategy, searchQuery }` (5/5 verified)

### 07 — Backend Orchestration
- [x] `/api/discover` input validation
- [x] Planning (once) → search → candidate pool assembly (deduped)
- [x] Ranking stub returns ordered `CandidateTrack[]` (no scores/explanations)
- [x] Deterministic broadened-search fallback when < min candidates
- [x] Response shape + error envelope correct; dev timing logs
- [x] Draft `ARCHITECTURE.md` (as-built + decisions, links to `/docs`)

### 08 — AI Recommendation Engine
- [x] Groq Call 2 ranking + explanations
- [x] Discovery Match scoring + server verification — principles-based prompt + `clampScore()` (approved refinement; not the literal weighted formula from `ai-workflow.md`)
- [x] Variety rule + trackId validation — unknown IDs discarded; one track per primary artist (server); near-duplicate title matching prompt-guided only (no server heuristic)
- [x] Fallback (broadened search) + min/target counts
- [x] Finalize `ARCHITECTURE.md` (real ranking layer reflected)

### 09 — Recommendation Cards
- [x] RecommendationCard (artwork, title, artist, score, explanation)
- [x] Actions: Continue in Spotify / Save / Skip hierarchy
- [x] Wired to `/api/discover` + LoadingState (orchestration in `DiscoveryFlow`)
- [x] Skip-count tracking (`sessionRef`; consumed by Phase 11 feedback trigger)

### 10 — Preview Player
- [x] PreviewPlayer inline with progress + finished state
- [x] Preview-unavailable degradation (`previewUrl === null` or playback error)
- [x] Single-active-player behavior (`activePreviewTrackId` in `DiscoveryFlow`)

### 11 — Feedback Loop
- [x] FeedbackDialog after 2 skips (optional/dismissible) — triggers after skip animation; single-select reason; submit guard
- [x] `/api/feedback` re-rank, no new search unless exhausted — Groq Call 3 only (no planning); context-only broadening on exhaustion
- [x] Client-held session state replayed correctly — `sessionRef` for pool/ids; React state for dialog/loading only
- [x] Shown/skipped excluded

### 12 — Polish
- [x] Limited / no-results / service-error states — guidelines copy; fixed friendly errors (no API message leakage)
- [x] Accessibility pass (keyboard, focus, contrast, alt, semantics) — arrow keys in selectors/dialog; combobox nav; 44px targets
- [x] Responsive (desktop/tablet/mobile) — touch targets; existing single-column layout retained
- [x] Motion polish + reduced-motion — card hover elevation; global + component `motion-reduce` honored

### 13 — Deployment
- [ ] Env vars in Vercel
- [ ] Production build passes
- [ ] Spotify + Groq verified in prod
- [ ] Previews tested live
- [ ] Full journey verified on deployed URL
