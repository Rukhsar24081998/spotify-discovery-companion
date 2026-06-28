/** SessionStorage key used when navigating from global search mood shortcuts. */
export const DISCOVER_MOOD_PREFILL_KEY = "discover:mood-prefill";

export function setDiscoverMoodPrefill(mood: string): void {
  try {
    sessionStorage.setItem(DISCOVER_MOOD_PREFILL_KEY, mood);
  } catch {
    // Ignore storage failures (private browsing, quota, etc.).
  }
}

export function consumeDiscoverMoodPrefill(): string | null {
  try {
    const value = sessionStorage.getItem(DISCOVER_MOOD_PREFILL_KEY);
    if (value) {
      sessionStorage.removeItem(DISCOVER_MOOD_PREFILL_KEY);
    }
    return value;
  } catch {
    return null;
  }
}
