/**
 * Groq (LLM) service. Encapsulates the two-call discovery flow plus feedback
 * re-ranking. Reasoning only — never invents tracks (see ai-workflow.md).
 *
 * Phase 02 exposes the final signatures only. Model configuration, JSON-mode
 * calls, schema validation, and retry-once are implemented in Phases 06 and 08.
 */

import type {
  DiscoveryContext,
  PlanningResult,
  RankingInput,
  RankingResult,
  RerankInput,
} from '@/types';

/**
 * Groq Call 1 — Planning. Reasons over intent → strategy → search query and
 * returns one combined JSON object.
 */
export async function generatePlan(context: DiscoveryContext): Promise<PlanningResult> {
  throw new Error(
    `groq.generatePlan not implemented (Phase 06). ` +
      `Context: mood=${context.mood}, activity=${context.activity}.`,
  );
}

/**
 * Groq Call 2 — Ranking. Scores and explains the candidate pool and returns the
 * ranked recommendations.
 */
export async function rankCandidates(input: RankingInput): Promise<RankingResult> {
  throw new Error(
    `groq.rankCandidates not implemented (Phase 08). Candidates: ${input.candidates.length}.`,
  );
}

/**
 * Feedback re-ranking. Re-ranks the remaining cached candidate pool using
 * session feedback, excluding already-shown and skipped tracks.
 */
export async function rerankCandidates(input: RerankInput): Promise<RankingResult> {
  throw new Error(
    `groq.rerankCandidates not implemented (Phase 11). Candidates: ${input.candidates.length}.`,
  );
}
