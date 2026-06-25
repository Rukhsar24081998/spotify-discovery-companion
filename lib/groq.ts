/**
 * Groq (LLM) service. Encapsulates the two-call discovery flow plus feedback
 * re-ranking. Reasoning only — never invents tracks (see ai-workflow.md).
 *
 * All Groq access is server-side via native fetch (no SDK). Upstream/parse
 * failures are mapped to the shared error envelope via GroqError + ErrorCode.
 */

import type {
  DiscoveryContext,
  ErrorCode,
  PlanningResult,
  RankedTrack,
  RankingInput,
  RankingResult,
  RerankInput,
} from '@/types';
import { buildPlanningPromptV1, buildRankingPromptV1, type ChatPrompt } from '@/lib/prompts';
import { normalizeExplanation } from '@/lib/ranking';
import { clampScore } from '@/lib/utils';
import { devLog } from '@/lib/log';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PLANNING_MODEL = 'llama-3.3-70b-versatile';
const PLANNING_FALLBACK_MODEL = 'llama-3.1-8b-instant';
const RANKING_MODEL = 'llama-3.3-70b-versatile';
const TEMPERATURE = 0.3;
const PLANNING_MAX_TOKENS = 1024;
const RANKING_MAX_TOKENS = 1536;
const MAX_EXPLANATION_SENTENCES = 3;

/** Error carrying a shared ErrorCode so API routes can map it to the envelope. */
export class GroqError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = 'GroqError';
    this.code = code;
  }
}

interface GroqChatResponse {
  choices?: { message?: { content?: string } }[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

/** Call Groq chat completions in JSON mode and return the raw message content. */
async function callGroqJson(
  model: string,
  prompt: ChatPrompt,
  maxTokens: number,
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqError('GROQ_UNAVAILABLE', 'Groq API key is not configured.');
  }

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: TEMPERATURE,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
    }),
  });

  if (!response.ok) {
    throw new GroqError('GROQ_UNAVAILABLE', `Groq request failed (${response.status}).`);
  }

  const json = (await response.json()) as GroqChatResponse;
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new GroqError('GROQ_UNAVAILABLE', 'Groq returned an empty response.');
  }
  return content;
}

/** Parse + validate + sanitize the planning JSON. Returns null when invalid. */
function parsePlanningResult(content: string): PlanningResult | null {
  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    return null;
  }
  if (!isObject(raw)) {
    return null;
  }

  const { intent, strategy, searchQuery } = raw;
  if (!isObject(intent) || !isObject(strategy)) {
    return null;
  }
  if (typeof searchQuery !== 'string' || searchQuery.trim() === '') {
    return null;
  }

  const intentFields = [
    'energy',
    'emotionalTone',
    'listeningContext',
    'familiarityPreference',
    'discoveryIntent',
  ] as const;
  for (const field of intentFields) {
    if (typeof intent[field] !== 'string') {
      return null;
    }
  }

  const strategyStringFields = ['energy', 'context', 'goal', 'tempo'] as const;
  for (const field of strategyStringFields) {
    if (typeof strategy[field] !== 'string') {
      return null;
    }
  }
  if (!isStringArray(strategy.language) || !isStringArray(strategy.avoid)) {
    return null;
  }

  return {
    intent: {
      energy: intent.energy as string,
      emotionalTone: intent.emotionalTone as string,
      listeningContext: intent.listeningContext as string,
      familiarityPreference: intent.familiarityPreference as string,
      discoveryIntent: intent.discoveryIntent as string,
    },
    strategy: {
      energy: strategy.energy as string,
      context: strategy.context as string,
      goal: strategy.goal as string,
      language: strategy.language,
      avoid: strategy.avoid,
      tempo: strategy.tempo as string,
    },
    searchQuery: searchQuery.trim(),
  };
}

function parseScore(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return clampScore(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return clampScore(parsed);
    }
  }
  return null;
}

/**
 * Parse a single ranked item. Returns null only for structural failures
 * (missing trackId, score, or explanation). Formatting issues are normalized.
 */
function parseRankedTrack(value: unknown): RankedTrack | null {
  if (!isObject(value)) {
    return null;
  }
  if (typeof value.trackId !== 'string' || value.trackId.trim() === '') {
    return null;
  }
  if (typeof value.explanation !== 'string' || value.explanation.trim() === '') {
    return null;
  }

  const score = parseScore(value.score);
  if (score === null) {
    return null;
  }

  return {
    trackId: value.trackId.trim(),
    score,
    explanation: normalizeExplanation(value.explanation, MAX_EXPLANATION_SENTENCES),
  };
}

/**
 * Parse ranking JSON. Retries only on structural failures (invalid JSON,
 * missing recommendations array, or zero parseable items). Skips malformed
 * individual items rather than failing the whole response.
 */
function parseRankingResult(content: string): RankingResult | null {
  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    return null;
  }
  if (!isObject(raw) || !Array.isArray(raw.recommendations)) {
    return null;
  }

  const recommendations: RankedTrack[] = [];
  for (const item of raw.recommendations) {
    const parsed = parseRankedTrack(item);
    if (parsed) {
      recommendations.push(parsed);
    }
  }

  if (recommendations.length === 0) {
    return null;
  }

  return { recommendations };
}

/**
 * Groq Call 1 — Planning. Turns the discovery context into validated
 * { intent, strategy, searchQuery } JSON. Retries once on parse/schema failure
 * and falls back to a smaller model if the primary is unavailable.
 */
export async function generatePlan(context: DiscoveryContext): Promise<PlanningResult> {
  const prompt = buildPlanningPromptV1(context);
  const models = [PLANNING_MODEL, PLANNING_FALLBACK_MODEL];
  let lastError: unknown;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const startedAt = Date.now();
        const content = await callGroqJson(model, prompt, PLANNING_MAX_TOKENS);
        const plan = parsePlanningResult(content);
        const elapsedMs = Date.now() - startedAt;

        if (plan) {
          devLog(`Planning OK (model=${model}, attempt=${attempt}, ${elapsedMs}ms).`);
          return plan;
        }

        devLog(
          `Planning output invalid (model=${model}, attempt=${attempt}); retrying once.`,
        );
        lastError = new GroqError('GROQ_UNAVAILABLE', 'Invalid planning output.');
      } catch (error) {
        lastError = error;
        devLog(`Planning call failed (model=${model}, attempt=${attempt}).`);
        break;
      }
    }
  }

  throw lastError instanceof GroqError
    ? lastError
    : new GroqError('GROQ_UNAVAILABLE', 'Planning failed after retries.');
}

/**
 * Groq Call 2 — Ranking. Scores and explains the candidate pool and returns the
 * ranked recommendations. Retries once on parse/schema failure.
 */
export async function rankCandidates(input: RankingInput): Promise<RankingResult> {
  if (input.candidates.length === 0) {
    return { recommendations: [] };
  }

  const prompt = buildRankingPromptV1(input);
  let lastError: unknown;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const startedAt = Date.now();
      const content = await callGroqJson(RANKING_MODEL, prompt, RANKING_MAX_TOKENS);
      const ranking = parseRankingResult(content);
      const elapsedMs = Date.now() - startedAt;

      if (ranking) {
        devLog(`Ranking OK (attempt=${attempt}, ${elapsedMs}ms, count=${ranking.recommendations.length}).`);
        return ranking;
      }

      devLog(`Ranking output invalid (attempt=${attempt}); retrying once.`);
      lastError = new GroqError('GROQ_UNAVAILABLE', 'Invalid ranking output.');
    } catch (error) {
      lastError = error;
      devLog(`Ranking call failed (attempt=${attempt}).`);
      break;
    }
  }

  throw lastError instanceof GroqError
    ? lastError
    : new GroqError('GROQ_UNAVAILABLE', 'Ranking failed after retries.');
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
