/**
 * Core discovery principles distilled from analysis of 183 Spotify user reviews
 * across multiple platforms. Guides AI strategy, diversity, and preference learning.
 *
 * Read-only product knowledge — do not mutate at runtime.
 */

export interface DiscoveryPrinciple {
  id: string;
  title: string;
  summary: string;
  rationale: string;
}

export const DISCOVERY_PRINCIPLES: readonly DiscoveryPrinciple[] = [
  {
    id: "reduce-fatigue",
    title: "Reduce recommendation fatigue",
    summary: "Reducing repetitive recommendations",
    rationale:
      "Review analysis showed users disengage when lists repeat the same artists, genres, and mainstream picks.",
  },
  {
    id: "balance-familiarity",
    title: "Balance familiarity with exploration",
    summary: "Mixing familiar artists with hidden gems",
    rationale:
      "Listeners want comfort before novelty; alternating familiar and exploratory picks keeps sessions engaging.",
  },
  {
    id: "explain-recommendations",
    title: "Explain every recommendation",
    summary: "Explaining why every recommendation appears",
    rationale:
      "Users need confidence to try unfamiliar music; transparent reasoning reduces skip rates.",
  },
  {
    id: "personalize-intent",
    title: "Personalize using user intent",
    summary: "Prioritizing music that matches your current intent",
    rationale:
      "Historical taste alone misses mood and activity context that drive present-moment listening.",
  },
  {
    id: "learn-from-feedback",
    title: "Learn from feedback",
    summary: "Learning from save and skip signals over time",
    rationale:
      "Save and skip actions signal style preferences; lightweight memory improves future relevance.",
  },
  {
    id: "promote-hidden-gems",
    title: "Promote hidden gems",
    summary: "Surfacing lesser-known artists with strong relevance",
    rationale:
      "Users reported that mainstream-heavy feeds limit meaningful discovery of new artists.",
  },
  {
    id: "preserve-context",
    title: "Preserve listening context",
    summary: "Keeping recommendations aligned with mood and activity",
    rationale:
      "Context-aware picks outperform generic suggestions during study, work, commute, and unwind sessions.",
  },
] as const;

/**
 * Summaries shown in the research-backed strategy preview.
 * Preserves the original five-item presentation in the discovery UI.
 */
export const STRATEGY_PRINCIPLE_SUMMARIES = [
  DISCOVERY_PRINCIPLES.find((p) => p.id === "reduce-fatigue")!.summary,
  DISCOVERY_PRINCIPLES.find((p) => p.id === "balance-familiarity")!.summary,
  DISCOVERY_PRINCIPLES.find((p) => p.id === "personalize-intent")!.summary,
  DISCOVERY_PRINCIPLES.find((p) => p.id === "explain-recommendations")!.summary,
  "Increasing discovery diversity",
] as const;

export const PREFERENCE_FEEDBACK_COPY = {
  save: "Future recommendations will include more music like this.",
  skip: "I'll reduce recommendations similar to this.",
  hintPrefix: "Based on your recent saves, we'll lean toward more",
  hintSuffix: "discoveries.",
} as const;
