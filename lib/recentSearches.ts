import { MIN_BROWSE_SEARCH_LENGTH } from "@/types";

const STORAGE_KEY = "spotify-discovery:recent-searches";
const MAX_RECENT_SEARCHES = 5;

/** Static suggestions shown when there is no recent search history. */
export const SEARCH_TRY_SUGGESTIONS = [
  "Taylor Swift",
  "Drake",
  "The Weeknd",
  "Happy",
  "Workout",
] as const;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function readStorage(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeStorage(searches: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

/** Returns the most recent unique searches (newest first), up to 5. */
export function getRecentSearches(): string[] {
  return readStorage().slice(0, MAX_RECENT_SEARCHES);
}

/**
 * Adds a search to recent history — dedupes case-insensitively, newest first, max 5.
 * Returns the updated list.
 */
export function addRecentSearch(rawQuery: string): string[] {
  const query = rawQuery.trim();
  if (query.length < MIN_BROWSE_SEARCH_LENGTH) {
    return getRecentSearches();
  }

  const needle = normalize(query);
  const withoutDuplicate = readStorage().filter((item) => normalize(item) !== needle);
  const next = [query, ...withoutDuplicate].slice(0, MAX_RECENT_SEARCHES);
  writeStorage(next);
  return next;
}

/** Clears all stored recent searches. */
export function clearRecentSearches(): void {
  writeStorage([]);
}
