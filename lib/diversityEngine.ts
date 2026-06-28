import type { Activity, CandidateTrack, Mood, Recommendation } from "@/types";
import {
  buildIntentAlignmentSentence,
  CATEGORY_EXPLANATION_COPY,
  DIVERSITY_ORDER_ROTATION,
  type KnowledgeDiversityCategory,
} from "@/knowledge/recommendationObjectives";
import {
  classifyRecommendation,
  type ClassificationContext,
  type DiversityCategory,
  buildPopularityMap,
  extractSavedArtistNames,
} from "@/lib/recommendationClassifier";
import {
  getPreferenceHint,
  getPreferenceProfile,
  type PreferenceProfile,
} from "@/lib/userPreferenceProfile";
import { getSavedRecommendations } from "@/lib/savedRecommendations";

export interface EnrichedRecommendation extends Recommendation {
  diversityCategory: DiversityCategory;
}

export interface DiversityMixCounts {
  "familiar-favorite": number;
  "similar-artist": number;
  "hidden-gem": number;
  "wildcard-discovery": number;
}

interface ExplanationContext {
  mood: Mood;
  activity: Activity;
  hasFavorites: boolean;
  preferenceHint: string | null;
}

function getCategoryExplanation(
  category: KnowledgeDiversityCategory,
  context: ExplanationContext,
): string {
  const copy = CATEGORY_EXPLANATION_COPY[category];

  if (category === "similar-artist" && context.hasFavorites && copy.withFavorites) {
    return copy.withFavorites;
  }

  return copy.default;
}

function enhanceExplanation(
  category: DiversityCategory,
  mood: Mood,
  activity: Activity,
  favoriteArtists: string[],
  preferenceProfile: PreferenceProfile,
): string {
  const context: ExplanationContext = {
    mood,
    activity,
    hasFavorites: favoriteArtists.length > 0,
    preferenceHint: getPreferenceHint(preferenceProfile),
  };

  const base = getCategoryExplanation(category, context);
  const intent = buildIntentAlignmentSentence(mood, activity);
  const hint = context.preferenceHint;

  return hint ? `${base} ${intent} ${hint}` : `${base} ${intent}`;
}

function sortBucket(items: EnrichedRecommendation[]): EnrichedRecommendation[] {
  return [...items].sort((a, b) => b.discoveryScore - a.discoveryScore);
}

/**
 * Alternates categories per DIVERSITY_ORDER_ROTATION to reduce repetitive lists
 * while preserving relevance (Reduced repetition secondary objective).
 */
export function orderForDiversity(
  items: EnrichedRecommendation[],
): EnrichedRecommendation[] {
  const buckets = new Map<DiversityCategory, EnrichedRecommendation[]>(
    DIVERSITY_ORDER_ROTATION.map((category) => [category, []]),
  );

  for (const item of items) {
    buckets.get(item.diversityCategory)?.push(item);
  }

  for (const category of DIVERSITY_ORDER_ROTATION) {
    buckets.set(category, sortBucket(buckets.get(category) ?? []));
  }

  const result: EnrichedRecommendation[] = [];
  const used = new Set<string>();
  let rotationIndex = 0;
  let idleRotations = 0;
  const maxIdle = DIVERSITY_ORDER_ROTATION.length * Math.max(items.length, 1);

  while (result.length < items.length && idleRotations < maxIdle) {
    const category = DIVERSITY_ORDER_ROTATION[rotationIndex % DIVERSITY_ORDER_ROTATION.length];
    rotationIndex += 1;

    const bucket = buckets.get(category) ?? [];
    const next = bucket.find((item) => !used.has(item.trackId));

    if (next) {
      result.push(next);
      used.add(next.trackId);
      idleRotations = 0;
    } else {
      idleRotations += 1;
    }
  }

  const remaining = sortBucket(items.filter((item) => !used.has(item.trackId)));
  return [...result, ...remaining];
}

export function countMix(items: EnrichedRecommendation[]): DiversityMixCounts {
  return items.reduce(
    (counts, item) => {
      counts[item.diversityCategory] += 1;
      return counts;
    },
    {
      "familiar-favorite": 0,
      "similar-artist": 0,
      "hidden-gem": 0,
      "wildcard-discovery": 0,
    } satisfies DiversityMixCounts,
  );
}

export interface EnrichRecommendationsInput {
  recommendations: Recommendation[];
  mood: Mood;
  activity: Activity;
  favoriteArtists: string[];
  candidatePool: CandidateTrack[];
  preferenceProfile?: PreferenceProfile;
}

/**
 * Classifies, explains, and re-orders recommendations using the knowledge layer.
 */
export function enrichRecommendations({
  recommendations,
  mood,
  activity,
  favoriteArtists,
  candidatePool,
  preferenceProfile = getPreferenceProfile(),
}: EnrichRecommendationsInput): EnrichedRecommendation[] {
  const classificationContext: ClassificationContext = {
    mood,
    activity,
    favoriteArtists,
    savedArtistNames: extractSavedArtistNames(getSavedRecommendations()),
    popularityByTrackId: buildPopularityMap(candidatePool),
    preferenceProfile,
  };

  const enriched: EnrichedRecommendation[] = recommendations.map((recommendation) => {
    const diversityCategory = classifyRecommendation(recommendation, classificationContext);
    return {
      ...recommendation,
      diversityCategory,
      explanation: enhanceExplanation(
        diversityCategory,
        mood,
        activity,
        favoriteArtists,
        preferenceProfile,
      ),
    };
  });

  return orderForDiversity(enriched);
}
