# Phase 08 — AI Recommendation Engine (Call 2)

**Reference docs:** `ai-workflow.md` (Step 5 AI Ranking, Discovery Match Scoring Methodology, Recommendation Logic, Recommendation Explanation, Groq Configuration, JSON Validation Rules, Expected AI Output), `tech-stack.md` (Recommendation Object), `cursor-rules.md` (AI Rules).

---

## Objective

Replace the Phase 07 ranking stub with Groq Call 2: rank candidates, compute the Discovery Match score via the documented formula, generate concise explanations, enforce variety, and validate every `trackId` — turning `/api/discover` into a production-quality recommendation engine.

## Scope

- In: `lib/groq.ts` ranking function, ranking prompt in `lib/prompts.ts`, scoring verification, variety + fallback, `trackId` reconciliation; integrate into `/api/discover`.
- Out: feedback re-ranking (Phase 11), UI (Phase 09).

## Deliverables

- A ranking function producing validated `{ recommendations: [{ trackId, score, explanation }] }`, integrated so `/api/discover` returns real Discovery Match scores and explanations.
- **Finalize `ARCHITECTURE.md`** — update the Phase 07 draft to reflect the real ranking layer (Discovery Match formula, `trackId` reconciliation, variety/fallback) now that the stub is replaced and the end-to-end architecture is complete.

## Files to create or modify

- `lib/groq.ts` — `rankCandidates` (Groq Call 2).
- `lib/prompts.ts` — ranking prompt + Discovery Match rubric.
- `app/api/discover/route.ts` — swap stub for real ranking.

## Components involved

- None.

## Backend work

- Send minimal candidate fields (id, title, artist, popularity) + `intent`/`strategy` to Groq.
- Parse + validate ranking JSON; clamp/round scores; **reconcile every `trackId` against the candidate set**, discarding unknowns.
- Optionally recompute the weighted score from returned dimensions to verify consistency.
- Apply variety rule and select target 5 / min 3; broadened-search fallback when short.

## APIs

- Spotify Search only on the broadened-search fallback.

## AI integrations

- Groq Call 2 (ranking + scoring + explanations).

## Dependencies

- Phase 07 (orchestration), Phase 06 (Groq client), Phase 05 (Spotify).

## Implementation notes

- Discovery Match formula (`ai-workflow.md`):
  `discoveryScore = round(0.30*contextMatch + 0.25*activityMatch + 0.30*discoveryPotential + 0.15*familiarityBalance)`, each input 0–100.
- Variety is **set-level**: max one track per artist, no near-duplicates, span the strategy (e.g. both languages).
- Balance: discovery-leaning by default; at least one high-familiarity track; never an all-favorites set.
- Explanations ≤ 3 sentences, human, positive, no technical jargon; never invent songs/artists/URLs.
- Model `llama-3.3-70b-versatile`, temp 0.3, JSON mode, `max_tokens` ~1536; retry-once on invalid JSON.

## Edge cases

- Hallucinated/unknown `trackId` → discarded before composing cards.
- Score out of range / non-integer → clamped/rounded.
- <3 valid after ranking → one broadened search + re-rank; still <3 → return available + `meta.limited`.
- Zero valid → `NO_RESULTS` semantics.
- Invalid ranking JSON after retry → `GROQ_UNAVAILABLE`.

## Testing checklist

- [ ] Returns 3–5 ranked, deduplicated recommendations with scores 0–100 and ≤3-sentence explanations.
- [ ] Unknown `trackId`s discarded; scores normalized.
- [ ] Variety rule enforced (one per artist, no near-dupes).
- [ ] At least one high-familiarity pick; never all-favorites.
- [ ] Fallback triggers correctly; `meta.limited` accurate.
- [ ] End-to-end `/api/discover` latency within ~1.5–3.3 s.

## Definition of Done

`/api/discover` returns production-quality recommendations with consistent, explainable Discovery Match scores and concise explanations, all sourced from validated Spotify tracks, meeting the documented recommendation logic.

## Risks

- **High.** Most complex phase; combines AI variability with strict business rules. Mitigation: scoring formula is deterministic and re-verified server-side; `trackId` reconciliation enforces "never invent"; built on the already-tested Phase 07 path.
