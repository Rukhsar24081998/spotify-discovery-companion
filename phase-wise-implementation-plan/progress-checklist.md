# Progress Checklist

Live tracker for the Spotify Discovery Companion build. Tick each phase only when its **Definition of Done** (in the phase document) is fully met and the phase has passed review.

**Overall completion: 8% (1 / 13 phases complete)**

> Update rule: each completed phase = ~7.7%. Recompute `completed / 13` after every merge.

---

## Phases

- [x] **01 — Project Setup** — Deployable Next.js 15 + TS + Tailwind skeleton
- [ ] **02 — Shared Architecture** — `types/`, `lib/` service skeletons, utilities
- [ ] **03 — Design System** — Theme tokens, primitives, Spotify Home + Discovery card
- [ ] **04 — Discovery Flow UI** — Input screen + LoadingState (mocked)
- [ ] **05 — Spotify API** — Token cache, Search, `/api/spotify/search`
- [ ] **06 — Groq Planning** — Groq Call 1 (intent → strategy → query)
- [ ] **07 — Backend Orchestration** — `/api/discover` with ranking stub
- [ ] **08 — AI Recommendation Engine** — Groq Call 2: ranking + Discovery Match + explanations
- [ ] **09 — Recommendation Cards** — Results screen + actions, wired to `/api/discover`
- [ ] **10 — Preview Player** — Inline 30-sec preview + unavailable degradation
- [ ] **11 — Feedback Loop** — FeedbackDialog + `/api/feedback`
- [ ] **12 — Polish** — Edge/empty/error states, a11y, responsiveness
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
- [ ] `types/` contracts (Recommendation, route I/O, error envelope, enums)
- [ ] `lib/utils.ts` validation + sanitization + score helpers
- [ ] `lib/` service signatures stubbed
- [ ] Unit tests for validators pass

### 03 — Design System
- [ ] Theme tokens (near-black bg, dark-gray cards, Spotify green accent)
- [ ] Primitives (pill button, card shell, headings) built
- [ ] Spotify Home renders with Discovery card
- [ ] "Discover" navigates to `/discover`
- [ ] Responsive + accessible

### 04 — Discovery Flow UI
- [ ] MoodSelector (single-select, canonical order)
- [ ] ActivitySelector (single-select, canonical order)
- [ ] ArtistSearch (max 3, debounced, mocked suggestions)
- [ ] LoadingState reasoning screen
- [ ] CTA gating + flow state container

### 05 — Spotify API
- [ ] Token fetch + in-memory cache w/ margin
- [ ] Search returns ~20 mapped candidates
- [ ] `/api/spotify/search` live; ArtistSearch wired
- [ ] preview_url availability measured
- [ ] 429 / empty / auth-fail handled

### 06 — Groq Planning
- [ ] `lib/groq.ts` planning call (model + temp + JSON mode)
- [ ] `lib/prompts.ts` planning prompt
- [ ] Schema validation + retry-once
- [ ] Returns valid `{ intent, strategy, searchQuery }`

### 07 — Backend Orchestration
- [ ] `/api/discover` input validation
- [ ] Planning → search → candidate pool assembly
- [ ] Ranking stub returns testable results
- [ ] Response shape + error envelope correct
- [ ] Draft `ARCHITECTURE.md` (as-built + decisions, links to `/docs`)

### 08 — AI Recommendation Engine
- [ ] Groq Call 2 ranking + explanations
- [ ] Discovery Match formula + score verification
- [ ] Variety rule + trackId validation
- [ ] Fallback (broadened search) + min/target counts
- [ ] Finalize `ARCHITECTURE.md` (real ranking layer reflected)

### 09 — Recommendation Cards
- [ ] RecommendationCard (artwork, title, artist, score, explanation)
- [ ] Actions: Continue in Spotify / Save / Skip hierarchy
- [ ] Wired to `/api/discover` + LoadingState
- [ ] Skip-count tracking

### 10 — Preview Player
- [ ] PreviewPlayer inline with progress + finished state
- [ ] Preview-unavailable degradation
- [ ] Single-active-player behavior

### 11 — Feedback Loop
- [ ] FeedbackDialog after 2 skips (optional/dismissible)
- [ ] `/api/feedback` re-rank, no new search unless exhausted
- [ ] Client-held session state replayed correctly
- [ ] Shown/skipped excluded

### 12 — Polish
- [ ] Limited / no-results / service-error states
- [ ] Accessibility pass (keyboard, focus, contrast, alt, semantics)
- [ ] Responsive (desktop/tablet/mobile)
- [ ] Motion polish + reduced-motion

### 13 — Deployment
- [ ] Env vars in Vercel
- [ ] Production build passes
- [ ] Spotify + Groq verified in prod
- [ ] Previews tested live
- [ ] Full journey verified on deployed URL
