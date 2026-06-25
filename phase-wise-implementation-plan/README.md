# Phase-Wise Implementation Plan

## Spotify Discovery Companion — Engineering Execution Roadmap

This folder is the **engineering execution roadmap** for building the Spotify Discovery Companion. It translates the frozen product documentation in `/docs` into a sequence of small, independently buildable, independently testable phases.

> **Source of truth:** The `/docs` folder is frozen and authoritative. This roadmap never overrides it. If anything here appears to conflict with `/docs`, `/docs` wins and the conflict must be raised, not silently resolved.

---

## 1. Overall Implementation Philosophy

The plan is built on six principles:

1. **Reusable architecture first.** Shared types, services, utilities, and the design system are built before any feature consumes them, so nothing is duplicated or retrofitted later.
2. **Visible progress early.** The UI (Home, Discovery card, input flow) is built against mock data before the backend exists, producing a clickable, demoable product within the first few phases.
3. **Isolate risk before integration.** The two riskiest dependencies — Spotify `preview_url` availability and Groq JSON reliability — are validated in standalone phases before the full pipeline depends on them.
4. **One responsibility per phase.** Each phase changes one architectural layer or feature, keeping diffs small, reviews fast, and debugging localized.
5. **Always shippable.** Every phase ends in a buildable, testable state. No phase leaves the app broken.
6. **Minimize technical debt.** Strict TypeScript, no `any`, no inline styles, components ≤ 300 lines, one responsibility per file — enforced from Phase 1, not bolted on at the end.

---

## 2. Phase Dependency Flow

```text
01 Project Setup
        │
        ▼
02 Shared Architecture ──────────────┐
        │                            │ (types/services imported everywhere)
        ▼                            │
03 Design System                     │
        │                            │
        ▼                            │
04 Discovery Flow UI (mocked)        │
        │                            │
        ├───────────────► 05 Spotify API ──┐
        │                            │      │
        │                06 Groq Planning ──┤
        │                            │      │
        ▼                            ▼      ▼
        │                07 Backend Orchestration (ranking stub)
        │                            │
        │                            ▼
        │                08 AI Recommendation Engine (real ranking)
        │                            │
        └───────────────►───────────┤
                                     ▼
                          09 Recommendation Cards
                                     │
                                     ▼
                          10 Preview Player
                                     │
                                     ▼
                          11 Feedback Loop
                                     │
                                     ▼
                          12 Polish (edge cases, a11y, responsive)
                                     │
                                     ▼
                          13 Deployment (Vercel)
```

**Critical path:** 01 → 02 → 05 → 06 → 07 → 08 → 09 → 11 → 13.
**Parallelizable:** the UI track (03 → 04 → 09 → 10) can run alongside the backend/AI track (05 → 06 → 07 → 08 → 11), converging at Phases 07–09.

---

## 3. Recommended Development Workflow

For **every** phase, follow this loop:

1. **Read** the linked `/docs` sections referenced in the phase file before writing anything.
2. **Re-read** the phase file's Objective, Scope, and Definition of Done.
3. **Branch** per phase (e.g. `phase-05-spotify-api`). Keep changes focused; no unrelated edits.
4. **Build** only what the phase's Scope lists. Do not pull work forward from later phases.
5. **Self-test** against the phase's Testing Checklist.
6. **Verify** the Definition of Done line by line.
7. **Review** (see below), then merge.
8. **Update** `progress-checklist.md` (tick the phase, recompute the percentage).

---

## 4. Review Process After Each Phase

Each phase is reviewed against four gates before it is considered complete:

- **Scope gate:** Only the documented MVP was built — no new features, no scope creep (`cursor-rules.md`).
- **Consistency gate:** Canonical terminology, component names, enum orders, and API names match `/docs` exactly.
- **Quality gate:** TypeScript strict (no `any`), Tailwind-only styling, files ≤ 300 lines, one responsibility per file, accessible markup, secrets server-only.
- **Test gate:** The phase's Testing Checklist passes and the Definition of Done is fully met.

A phase that fails any gate is not merged until fixed. Optionally run a Bugbot/security review on phases that touch API routes (05, 07, 08, 11) and deployment (13).

---

## 5. Estimated Timeline

Single engineer, including per-phase testing and review:

| Phase | Complexity | Estimate |
| --- | --- | --- |
| 01 Project Setup | Low | 0.5 day |
| 02 Shared Architecture | Low–Medium | 1 day |
| 03 Design System | Low–Medium | 1 day |
| 04 Discovery Flow UI | Medium | 1.5 days |
| 05 Spotify API | Medium–High | 2 days |
| 06 Groq Planning | Medium–High | 1.5 days |
| 07 Backend Orchestration | Medium | 1.5 days |
| 08 AI Recommendation Engine | High | 2 days |
| 09 Recommendation Cards | Medium | 1.5 days |
| 10 Preview Player | Medium | 1 day |
| 11 Feedback Loop | Medium–High | 2 days |
| 12 Polish | Medium | 1.5 days |
| 13 Deployment | Low–Medium | 0.5 day |

**Total: ≈ 17–19 working days (~3.5 weeks)** solo.
**Two engineers (UI + backend/AI tracks in parallel): ≈ 2 to 2.5 weeks.**

---

## 6. Best Practices for Implementing Each Phase

- **Honor the docs precedence:** problem-statement → implementation-plan → ai-workflow → ui-guidelines → tech-stack → cursor-rules.
- **Build to the contract, not the implementation:** import shared `types/` so client and server never drift.
- **Keep secrets server-side:** Groq and Spotify are only ever called from API routes.
- **Fail gracefully everywhere:** every external call has a documented degradation path (see each phase's Edge Cases).
- **Mock before integrate:** UI phases consume mocks shaped exactly like the real contracts, so wiring later is a swap, not a rewrite.
- **Test the seams:** the highest-value tests are at integration boundaries (Spotify mapping, Groq JSON validation, `trackId` reconciliation).
- **Stop and ask on ambiguity:** if `/docs` is silent or contradictory, raise it rather than inventing behavior.

---

## 7. Files in This Folder

| File | Purpose |
| --- | --- |
| `README.md` | This document — philosophy, flow, workflow, timeline. |
| `00-roadmap.md` | High-level overview of all phases and execution order. |
| `01-project-setup.md` → `13-deployment.md` | One detailed plan per phase. |
| `progress-checklist.md` | Live progress tracker with checkboxes and completion %. |

Each phase document contains: Objective, Scope, Deliverables, Files to create or modify, Components involved, Backend work, APIs, AI integrations, Dependencies, Implementation notes, Edge cases, Testing checklist, Definition of Done, and Risks.
