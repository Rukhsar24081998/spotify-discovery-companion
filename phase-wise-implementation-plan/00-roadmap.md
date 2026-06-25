# 00 — Roadmap Overview

A high-level map of all 13 implementation phases, their purpose, and the order of execution. Each phase has a dedicated document with full detail.

> The `/docs` folder is frozen and is the single source of truth. This roadmap operationalizes it; it does not change product scope, the user journey, or the MVP.

---

## Phase Summary

| # | Phase | Layer | Purpose | Complexity |
| --- | --- | --- | --- | --- |
| 01 | Project Setup | Foundation | Deployable Next.js 15 + TS + Tailwind skeleton | Low |
| 02 | Shared Architecture | Foundation | `types/`, `lib/` service skeletons, `utils` | Low–Medium |
| 03 | Design System | UI foundation | Theme tokens, primitives, Spotify Home + Discovery card | Low–Medium |
| 04 | Discovery Flow UI | UI | Input screen (mood/activity/artist) + LoadingState, mocked | Medium |
| 05 | Spotify API | Backend/Integration | Token cache, Search, `/api/spotify/search` | Medium–High |
| 06 | Groq Planning | AI | Groq Call 1 (intent → strategy → query) + prompts | Medium–High |
| 07 | Backend Orchestration | Backend | `/api/discover` wiring with a ranking stub | Medium |
| 08 | AI Recommendation Engine | AI | Groq Call 2: ranking, Discovery Match, explanations | High |
| 09 | Recommendation Cards | UI | Results screen, actions, wire to `/api/discover` | Medium |
| 10 | Preview Player | UI | Inline 30-sec preview + unavailable degradation | Medium |
| 11 | Feedback Loop | Full-stack | FeedbackDialog + `/api/feedback` re-ranking | Medium–High |
| 12 | Polish | Cross-cutting | Edge/empty/error states, a11y, responsiveness | Medium |
| 13 | Deployment | Ops | Vercel production deploy + verification | Low–Medium |

---

## Why This Structure

This refines the original 12-step roadmap by splitting the two heaviest, riskiest units into smaller, independently testable phases:

- **Orchestration (07) is separated from AI ranking (08).** Phase 07 delivers a working `/api/discover` endpoint using a deterministic ranking stub (e.g. by popularity), so the entire request path is testable before AI ranking exists. Phase 08 then swaps in Groq ranking with the Discovery Match formula. This isolates AI risk and makes debugging trivial — if results break in 08, the cause is the ranking layer, not orchestration.
- **Recommendation cards (09) are separated from the preview player (10).** Cards render and the journey reaches "Continue in Spotify" before the preview — the most fragile, externally dependent feature — is layered on. Preview failures never block core discovery.
- **The design system (03) is its own phase**, so primitives exist before screens consume them.

---

## ARCHITECTURE.md Timing (decision)

`ARCHITECTURE.md` (repo root) is **drafted in Phase 07** and **finalized in Phase 08** — not earlier. Rationale: before Phase 05–08 it would only restate the frozen `/docs` and document intentions rather than the as-built system. By Phase 07 the service boundaries, route-orchestrates pattern, two-call Groq flow, stateless session model, and error conventions are real and stable; Phase 08 adds the real ranking layer. It is kept as a navigational + as-built-decisions doc that links to `/docs`, not a duplicate of it.

---

## Execution Order

**Sequential (single engineer):**

```text
01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13
```

**Parallel (two engineers):**

```text
UI track:       03 → 04 → 09 → 10 ┐
                                  ├─ converge at 09, then 11 → 12 → 13
Backend/AI:  05 → 06 → 07 → 08 ───┘
(both depend on 01 → 02 first)
```

---

## Phase Dependency Rules

- **01 and 02 block everything.** No feature work begins until the foundation and shared contracts exist.
- **04 can use mocks** shaped like the real `types/`, so it does not block on 05–08.
- **07 depends on 05 + 06.** Orchestration needs the Spotify service and the planning call.
- **08 depends on 07.** Ranking plugs into a working orchestration path.
- **09 depends on 07 (min) / 08 (ideal).** Cards can render against the 07 stub, then benefit from 08's real scores.
- **10 depends on 09.** Preview lives inside the card.
- **11 depends on 08 + 09.** Re-ranking reuses the candidate pool and updates the cards.
- **12 depends on 02–11.** Hardening spans the whole app.
- **13 depends on all.**

---

## Definition of Project Done (from `/docs`)

The build is complete when a user can: open Discovery Companion from Spotify Home → select mood + activity → optionally add artists → receive 3–5 contextual AI recommendations with explanations and Discovery Match scores → play a 30-sec preview when available → save/skip → refine via feedback after 2 skips → continue listening in Spotify — all deployed on Vercel with clean separation between AI reasoning and Spotify infrastructure.
