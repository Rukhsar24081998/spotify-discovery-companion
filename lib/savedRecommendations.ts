import type { Recommendation } from "@/types";

export const SAVED_RECOMMENDATIONS_STORAGE_KEY =
  "spotify-discovery:saved-recommendations";

export interface SavedRecommendation {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  spotifyUrl: string;
  matchScore: number;
  aiExplanation: string;
  timestampSaved: number;
}

export type LibrarySectionKey = "today" | "yesterday" | "earlier";

export const LIBRARY_SECTION_LABELS: Record<LibrarySectionKey, string> = {
  today: "Saved Today",
  yesterday: "Yesterday",
  earlier: "Earlier",
};

function isValidBaseFields(item: Record<string, unknown>): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.artist === "string" &&
    typeof item.artwork === "string" &&
    typeof item.spotifyUrl === "string" &&
    typeof item.matchScore === "number" &&
    typeof item.aiExplanation === "string"
  );
}

function normalizeSavedRecommendation(value: unknown): SavedRecommendation | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Record<string, unknown>;
  if (!isValidBaseFields(item)) {
    return null;
  }

  return {
    id: item.id as string,
    title: item.title as string,
    artist: item.artist as string,
    artwork: item.artwork as string,
    spotifyUrl: item.spotifyUrl as string,
    matchScore: item.matchScore as number,
    aiExplanation: item.aiExplanation as string,
    timestampSaved:
      typeof item.timestampSaved === "number" ? item.timestampSaved : 0,
  };
}

function sortNewestFirst(items: SavedRecommendation[]): SavedRecommendation[] {
  return [...items].sort((a, b) => b.timestampSaved - a.timestampSaved);
}

function readStorage(): SavedRecommendation[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SAVED_RECOMMENDATIONS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const seen = new Set<string>();
    const items: SavedRecommendation[] = [];

    for (const entry of parsed) {
      const normalized = normalizeSavedRecommendation(entry);
      if (!normalized || seen.has(normalized.id)) {
        continue;
      }
      seen.add(normalized.id);
      items.push(normalized);
    }

    return sortNewestFirst(items);
  } catch {
    return [];
  }
}

function writeStorage(items: SavedRecommendation[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      SAVED_RECOMMENDATIONS_STORAGE_KEY,
      JSON.stringify(sortNewestFirst(items)),
    );
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function getSavedRecommendations(): SavedRecommendation[] {
  return readStorage();
}

export function recommendationToSaved(
  recommendation: Recommendation,
): SavedRecommendation {
  return {
    id: recommendation.trackId,
    title: recommendation.title,
    artist: recommendation.artist,
    artwork: recommendation.albumArt,
    spotifyUrl: recommendation.spotifyUrl,
    matchScore: recommendation.discoveryScore,
    aiExplanation: recommendation.explanation,
    timestampSaved: Date.now(),
  };
}

/** Adds or removes a recommendation; returns the updated list (newest first). */
export function toggleSavedRecommendation(
  recommendation: Recommendation,
): SavedRecommendation[] {
  const saved = recommendationToSaved(recommendation);
  const existing = readStorage();
  const index = existing.findIndex((item) => item.id === saved.id);

  if (index >= 0) {
    const next = existing.filter((item) => item.id !== saved.id);
    writeStorage(next);
    return next;
  }

  const next = [saved, ...existing];
  writeStorage(next);
  return next;
}

export function isRecommendationSaved(id: string): boolean {
  return readStorage().some((item) => item.id === id);
}

export function removeSavedRecommendation(id: string): SavedRecommendation[] {
  const next = readStorage().filter((item) => item.id !== id);
  writeStorage(next);
  return next;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getLibrarySection(timestampSaved: number): LibrarySectionKey {
  if (timestampSaved <= 0) {
    return "earlier";
  }

  const savedDay = startOfLocalDay(new Date(timestampSaved));
  const today = startOfLocalDay(new Date());
  const diffMs = today.getTime() - savedDay.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "today";
  }
  if (diffDays === 1) {
    return "yesterday";
  }
  return "earlier";
}

export function formatSavedDateLabel(timestampSaved: number): string {
  const section = getLibrarySection(timestampSaved);

  if (section === "today") {
    return "Saved today";
  }
  if (section === "yesterday") {
    return "Saved yesterday";
  }

  if (timestampSaved <= 0) {
    return "Saved earlier";
  }

  const formatted = new Date(timestampSaved).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  return `Saved ${formatted}`;
}

export function groupSavedBySection(
  items: SavedRecommendation[],
): { key: LibrarySectionKey; items: SavedRecommendation[] }[] {
  const groups: Record<LibrarySectionKey, SavedRecommendation[]> = {
    today: [],
    yesterday: [],
    earlier: [],
  };

  for (const item of items) {
    groups[getLibrarySection(item.timestampSaved)].push(item);
  }

  return (["today", "yesterday", "earlier"] as const)
    .filter((key) => groups[key].length > 0)
    .map((key) => ({ key, items: groups[key] }));
}
