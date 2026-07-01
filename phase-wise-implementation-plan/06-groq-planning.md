# Phase 06 — Groq Planning (Call 1)

**Reference docs:** `ai-workflow.md` (AI Responsibilities Steps 1–3, Groq Call 1 Combined Planning Output, Groq Configuration, JSON Validation Rules, Prompting Strategy), `tech-stack.md` (AI Layer, Security), `cursor-rules.md` (AI Rules, API Rules).

---

## Objective

Implement Groq Call 1 — the combined planning call that turns `{ mood, activity, favoriteArtists }` into `{ intent, strategy, searchQuery }` — in isolation, with strict JSON validation, de-risking model reliability before orchestration.

## Scope

- In: `lib/groq.ts` planning function, `lib/prompts.ts` planning prompt, JSON parsing + schema validation + retry-once.
- Out: ranking (Phase 08), Spotify wiring (Phase 07).

## Deliverables

- A reusable planning function that reliably returns validated structured JSON suitable to drive Spotify Search.

## Files to create or modify

- `lib/groq.ts` — Groq client setup + `generatePlan` (planning call).
- `lib/prompts.ts` — system prompt + planning prompt.

## Components involved

- None.

## Backend work

- Groq client configured per `ai-workflow.md` → Groq Configuration.
- JSON parse + schema validation; retry once on parse/schema failure; graceful `GROQ_UNAVAILABLE` on final failure.

## APIs

- None (Spotify is wired in Phase 07).

## AI integrations

- Groq planning call (Call 1).

## Dependencies

- Phases 01–02. `GROQ_API_KEY` in `.env.local`.

## Implementation notes

- Model `openai/gpt-oss-120b`; `temperature` 0.3; response format `{ "type": "json_object" }`; bounded `max_tokens` (~1024).
- GPT-OSS JSON params: `include_reasoning: false`, `reasoning_effort: "low"`.
- Output object: `{ intent, strategy, searchQuery }` exactly as documented; `searchQuery` is a non-empty Spotify-friendly string.
- The model must reason about listening goal, **never** map mood → genre directly (`ai-workflow.md` → Step 1).
- Prompt-injection hygiene: insert user artist text as data, instruct the model to ignore embedded instructions.
- Keep prompts concise (performance). Server-only; never call Groq from the browser.
- Fallback model `openai/gpt-oss-20b` permitted for planning if the primary is unavailable.

## Edge cases

- Malformed JSON → retry once, then `GROQ_UNAVAILABLE`.
- Missing/mistyped keys (`intent`, `strategy`, `searchQuery`) → validation failure path.
- Empty `searchQuery` → treated as invalid.
- No favorite artists provided → still produces a valid plan.

## Testing checklist

- [ ] Returns valid JSON across varied mood/activity/artist inputs.
- [ ] Schema validation rejects malformed/missing keys; retry-once works.
- [ ] `searchQuery` is non-empty and search-appropriate.
- [ ] Final failure returns a clean `GROQ_UNAVAILABLE` (no crash).
- [ ] Latency roughly within the 400–900 ms budget.
- [ ] No Groq key reachable from the client.

## Definition of Done

The planning call reliably emits validated `{ intent, strategy, searchQuery }` JSON usable to drive Spotify Search, with retry and graceful failure.

## Risks

- **Medium–High.** LLM may emit invalid JSON or weak queries. Mitigation: JSON mode, low temperature, schema validation, retry-once, concise prompt. Validated standalone before orchestration depends on it.
