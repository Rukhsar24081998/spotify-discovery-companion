import type { Recommendation } from "@/types";
import type { PreferenceProfile } from "@/lib/userPreferenceProfile";

export type DiversityCategory =
  | "familiar-favorite"
  | "hidden-gem"
  | "similar-artist"
  | "wildcard-discovery";

export const DIVERSITY_CATEGORIES: DiversityCategory[] = [
  "familiar-favorite",
  "similar-artist",
  "hidden-gem",
  "wildcard-discovery",
];

export const DIVERSITY_CATEGORY_LABELS: Record<
  DiversityCategory,
  { emoji: string; label: string }
> = {
  "familiar-favorite": { emoji: "❤️", label: "Familiar Favorites" },
  "similar-artist": { emoji: "🎵", label: "Similar Artists" },
  "hidden-gem": { emoji: "✨", label: "Hidden Gems" },
  "wildcard-discovery": { emoji: "🚀", label: "Wildcard Discoveries" },
};

export interface ClassificationContext {
  mood: string;
  activity: string;
  favoriteArtists: string[];
  savedArtistNames: string[];
  popularityByTrackId: Map<string, number>;
  preferenceProfile: PreferenceProfile;
}

function normalizeArtist(value: string): string {
  return value.trim().toLowerCase();
}

function primaryArtist(artist: string): string {
  return normalizeArtist(artist.split(",")[0] ?? artist);
}

function artistMatchesFavorites(artist: string, favorites: string[]): boolean {
  const primary = primaryArtist(artist);
  return favorites.some((favorite) => {
    const normalized = normalizeArtist(favorite);
    return primary === normalized || primary.includes(normalized) || normalized.includes(primary);
  });
}

function artistInSavedLibrary(artist: string, savedArtists: string[]): boolean {
  const primary = primaryArtist(artist);
  return savedArtists.some((saved) => primaryArtist(saved) === primary);
}

function getPopularity(
  trackId: string,
  popularityByTrackId: Map<string, number>,
): number {
  return popularityByTrackId.get(trackId) ?? 50;
}

/**
 * Assigns exactly one diversity category per recommendation using
 * popularity, similarity score, favorites, saves, and preference hints.
 *
 * Classification priorities align with primary objectives from the knowledge layer
 * (relevance, diversity, novelty — see knowledge/recommendationObjectives.ts).
 */
export function classifyRecommendation(
  recommendation: Recommendation,
  context: ClassificationContext,
): DiversityCategory {
  const score = recommendation.discoveryScore;
  const popularity = getPopularity(recommendation.trackId, context.popularityByTrackId);
  const hasFavorites = context.favoriteArtists.length > 0;

  if (
    artistMatchesFavorites(recommendation.artist, context.favoriteArtists) ||
    artistInSavedLibrary(recommendation.artist, context.savedArtistNames) ||
    (hasFavorites && score >= 82 && popularity >= 62)
  ) {
    return "familiar-favorite";
  }

  if (
    popularity <= 42 ||
    (popularity <= 58 && score >= 68) ||
    (score >= 70 && score <= 84 && popularity <= 52)
  ) {
    return "hidden-gem";
  }

  if (score < 66 || (popularity >= 70 && score <= 73)) {
    return "wildcard-discovery";
  }

  if ((hasFavorites && score >= 74) || (!hasFavorites && score >= 76)) {
    return "similar-artist";
  }

  if (popularity <= 55 && score >= 64) {
    return "hidden-gem";
  }

  return "wildcard-discovery";
}

export function buildPopularityMap(
  candidatePool: { trackId: string; popularity: number }[],
): Map<string, number> {
  return new Map(candidatePool.map((track) => [track.trackId, track.popularity]));
}

export function extractSavedArtistNames(
  savedRecommendations: { artist: string }[],
): string[] {
  const seen = new Set<string>();
  const artists: string[] = [];

  for (const item of savedRecommendations) {
    const primary = primaryArtist(item.artist);
    if (!seen.has(primary)) {
      seen.add(primary);
      artists.push(item.artist);
    }
  }

  return artists;
}
