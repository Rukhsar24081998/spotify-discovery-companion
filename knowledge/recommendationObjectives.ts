/**
 * Recommendation objectives derived from analysis of 183 Spotify user reviews.
 * Shapes diversity ordering, classification priorities, and explainable copy.
 *
 * Read-only product knowledge — do not mutate at runtime.
 */

export interface RecommendationGoal {
  id: string;
  label: string;
  description: string;
}

export const RECOMMENDATION_OBJECTIVES = {
  primary: [
    {
      id: "relevance",
      label: "Relevance",
      description: "Match the user's mood, activity, and stated inspiration artists.",
    },
    {
      id: "diversity",
      label: "Diversity",
      description: "Vary recommendation types so lists feel fresh instead of repetitive.",
    },
    {
      id: "novelty",
      label: "Novelty",
      description: "Introduce artists and tracks the user may not have heard recently.",
    },
    {
      id: "explainability",
      label: "Explainability",
      description: "State why each pick appears and how it connects to user intent.",
    },
    {
      id: "personalization",
      label: "Personalization",
      description: "Adapt over time using save and skip feedback stored locally.",
    },
  ] satisfies RecommendationGoal[],

  secondary: [
    {
      id: "hidden-gem-discovery",
      label: "Hidden gem discovery",
      description: "Prioritize lesser-known artists with strong contextual fit.",
    },
    {
      id: "familiarity-balance",
      label: "Familiarity balance",
      description: "Anchor sessions with comfortable picks before broader exploration.",
    },
    {
      id: "reduced-repetition",
      label: "Reduced repetition",
      description: "Alternate categories to avoid consecutive similar recommendations.",
    },
  ] satisfies RecommendationGoal[],
} as const;

/** Diversity category keys used by the recommendation classifier. */
export type KnowledgeDiversityCategory =
  | "familiar-favorite"
  | "hidden-gem"
  | "similar-artist"
  | "wildcard-discovery";

/**
 * Category ordering rotation — implements the "Reduced repetition" secondary objective.
 * Pattern: Familiar → Similar → Hidden Gem → Similar → Wildcard.
 */
export const DIVERSITY_ORDER_ROTATION: readonly KnowledgeDiversityCategory[] = [
  "familiar-favorite",
  "similar-artist",
  "hidden-gem",
  "similar-artist",
  "wildcard-discovery",
];

export interface CategoryExplanationCopy {
  default: string;
  withFavorites?: string;
}

/** Explainable-AI copy mapped to each diversity category. */
export const CATEGORY_EXPLANATION_COPY: Record<
  KnowledgeDiversityCategory,
  CategoryExplanationCopy
> = {
  "familiar-favorite": {
    default:
      "A familiar favorite chosen to create a comfortable starting point before introducing new discoveries.",
  },
  "hidden-gem": {
    default:
      "A lesser-known artist with strong relevance to your preferences, selected to reduce recommendation fatigue.",
  },
  "similar-artist": {
    default:
      "An artist with a similar sound profile chosen to stay close to your current taste while still feeling fresh.",
    withFavorites:
      "A closely related artist sharing musical characteristics with your selected inspiration.",
  },
  "wildcard-discovery": {
    default:
      "A carefully chosen crossover recommendation designed to expand your music discovery while remaining compatible with your current mood.",
  },
};

/** Appended to every explanation to connect picks to present-moment intent. */
export function buildIntentAlignmentSentence(mood: string, activity: string): string {
  return `It aligns with your ${mood.toLowerCase()} mood while ${activity.toLowerCase()}.`;
}
