import { MOOD_CHIP_LABELS } from "@/components/discover/discoveryInputOptions";
import { ARTWORK_PLACEHOLDER_SRC } from "@/lib/mockBrowseContent";
import { MOODS, type Mood } from "@/types";

export interface MoodSearchEntry {
  id: string;
  kind: "mood";
  label: string;
  detail: string;
  imageUrl: string;
  mood: Mood;
}

const MOOD_CATALOG: MoodSearchEntry[] = MOODS.map((mood) => ({
  id: `mood-${mood}`,
  kind: "mood" as const,
  label: MOOD_CHIP_LABELS[mood],
  detail: "Mood · AI Discovery",
  imageUrl: ARTWORK_PLACEHOLDER_SRC,
  mood,
}));

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** Local mood shortcuts — not backed by Spotify Search. */
export function searchMoods(rawQuery: string, limit = 5): MoodSearchEntry[] {
  const needle = normalize(rawQuery);
  if (needle.length < 2) {
    return [];
  }

  return MOOD_CATALOG.filter((entry) => {
    const label = normalize(entry.label);
    const labelWithoutEmoji = normalize(entry.label.replace(/[^\w\s]/g, ""));
    return (
      normalize(entry.mood).includes(needle) ||
      label.includes(needle) ||
      labelWithoutEmoji.includes(needle)
    );
  }).slice(0, limit);
}
