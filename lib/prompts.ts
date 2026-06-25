/**
 * Groq prompt builders, isolated from orchestration logic.
 *
 * Phase 02 exposes the final signatures only; prompt content is authored in
 * Phase 06 (planning) and Phase 08 (ranking). Bodies are intentionally stubbed.
 */

import type { DiscoveryContext, RankingInput, RerankInput } from '@/types';

/** A system/user message pair sent to Groq. */
export interface ChatPrompt {
  system: string;
  user: string;
}

/** Build the Groq Call 1 (planning) prompt from the discovery context. */
export function buildPlanningPrompt(context: DiscoveryContext): ChatPrompt {
  throw new Error(
    `prompts.buildPlanningPrompt not implemented (Phase 06). ` +
      `Context: mood=${context.mood}, activity=${context.activity}.`,
  );
}

/** Build the Groq Call 2 (ranking) prompt from the candidate pool and strategy. */
export function buildRankingPrompt(input: RankingInput): ChatPrompt {
  throw new Error(
    `prompts.buildRankingPrompt not implemented (Phase 08). ` +
      `Candidates: ${input.candidates.length}.`,
  );
}

/** Build the Groq feedback re-ranking prompt from session feedback. */
export function buildRerankingPrompt(input: RerankInput): ChatPrompt {
  throw new Error(
    `prompts.buildRerankingPrompt not implemented (Phase 11). ` +
      `Reasons: ${input.reasons.length}.`,
  );
}
