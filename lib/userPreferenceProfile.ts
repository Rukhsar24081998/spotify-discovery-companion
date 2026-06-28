import type { DiversityCategory } from "@/lib/recommendationClassifier";
import { PREFERENCE_FEEDBACK_COPY } from "@/knowledge/discoveryPrinciples";

export const PREFERENCE_PROFILE_STORAGE_KEY = "spotify-discovery:preference-profile";

export type PreferenceProfile = Record<string, number>;

const CATEGORY_STYLE_DELTAS: Record<DiversityCategory, Record<string, number>> = {
  "familiar-favorite": { mainstream: 1, pop: 1 },
  "hidden-gem": { indie: 2, acoustic: 1 },
  "similar-artist": { indie: 1, alternative: 1 },
  "wildcard-discovery": { electronic: 1, experimental: 1 },
};

const STYLE_LABELS: Record<string, string> = {
  acoustic: "acoustic",
  indie: "indie",
  electronic: "electronic",
  hiphop: "hip-hop",
  mainstream: "mainstream",
  pop: "pop",
  alternative: "alternative",
  experimental: "experimental",
};

function readProfile(): PreferenceProfile {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PREFERENCE_PROFILE_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const profile: PreferenceProfile = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        profile[key] = value;
      }
    }
    return profile;
  } catch {
    return {};
  }
}

function writeProfile(profile: PreferenceProfile): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(PREFERENCE_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function getPreferenceProfile(): PreferenceProfile {
  return readProfile();
}

function applyDeltas(
  profile: PreferenceProfile,
  deltas: Record<string, number>,
): PreferenceProfile {
  const next = { ...profile };

  for (const [tag, delta] of Object.entries(deltas)) {
    const current = next[tag] ?? 0;
    const updated = current + delta;
    if (updated === 0) {
      delete next[tag];
    } else {
      next[tag] = updated;
    }
  }

  return next;
}

/** Increases genre/style weights after a recommendation is saved. */
export function applySavePreference(category: DiversityCategory): PreferenceProfile {
  const next = applyDeltas(readProfile(), CATEGORY_STYLE_DELTAS[category]);
  writeProfile(next);
  return next;
}

/** Decreases genre/style weights after a recommendation is skipped. */
export function applySkipPreference(category: DiversityCategory): PreferenceProfile {
  const negativeDeltas = Object.fromEntries(
    Object.entries(CATEGORY_STYLE_DELTAS[category]).map(([tag, value]) => [tag, -value]),
  );
  const next = applyDeltas(readProfile(), negativeDeltas);
  writeProfile(next);
  return next;
}

/** Optional hint woven into diversity explanations when weights are strong. */
export function getPreferenceHint(profile: PreferenceProfile): string | null {
  const positive = Object.entries(profile)
    .filter(([, weight]) => weight >= 2)
    .sort((a, b) => b[1] - a[1]);

  if (positive.length === 0) {
    return null;
  }

  const [tag] = positive[0];
  const label = STYLE_LABELS[tag] ?? tag;
  return `${PREFERENCE_FEEDBACK_COPY.hintPrefix} ${label} ${PREFERENCE_FEEDBACK_COPY.hintSuffix}`;
}

export const SAVE_PREFERENCE_MESSAGE = PREFERENCE_FEEDBACK_COPY.save;

export const SKIP_PREFERENCE_MESSAGE = PREFERENCE_FEEDBACK_COPY.skip;
