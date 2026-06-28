import type { Activity, Mood } from "@/types";

const PLACEHOLDER_GENRES = ["Pop", "Rock", "Hip-Hop", "Electronic"] as const;

type GenreTuple = readonly [string, string, string, string];

const GENRES_BY_MOOD_ACTIVITY: Record<Mood, Record<Activity, GenreTuple>> = {
  Happy: {
    Workout: ["Pop", "Dance", "Hip-Hop", "EDM"],
    Studying: ["Indie Pop", "Lo-fi", "Acoustic", "Funk"],
    Working: ["Pop", "Indie", "Soul", "Funk"],
    Driving: ["Pop", "Indie Pop", "Dance", "Rock"],
    Relaxing: ["Indie Pop", "Soft Rock", "Acoustic", "Soul"],
    Traveling: ["Pop", "World", "Indie", "Dance"],
    Gaming: ["Electronic", "Hip-Hop", "Rock", "Synthwave"],
    Cooking: ["Jazz", "Soul", "Pop", "Bossa Nova"],
  },
  Calm: {
    Workout: ["Yoga Beats", "Downtempo", "Ambient", "Chillwave"],
    Studying: ["Lo-fi", "Acoustic", "Piano", "Ambient"],
    Working: ["Ambient", "Piano", "Classical", "Minimal"],
    Driving: ["Soft Rock", "Indie Folk", "Acoustic", "Jazz"],
    Relaxing: ["Ambient", "Acoustic", "New Age", "Piano"],
    Traveling: ["Ambient", "World", "Acoustic", "Jazz"],
    Gaming: ["Ambient", "Lo-fi", "Soundtrack", "Chillwave"],
    Cooking: ["Jazz", "Acoustic", "Bossa Nova", "Soul"],
  },
  Energetic: {
    Workout: ["EDM", "Hip-Hop", "Rock", "Phonk"],
    Studying: ["Upbeat Pop", "Funk", "Electronic", "Indie"],
    Working: ["EDM", "Pop", "Rock", "House"],
    Driving: ["Rock", "EDM", "Hip-Hop", "Punk"],
    Relaxing: ["Dance Pop", "Disco", "Funk", "Reggae"],
    Traveling: ["Pop", "EDM", "Latin", "Dance"],
    Gaming: ["EDM", "Metal", "Hip-Hop", "Synthwave"],
    Cooking: ["Latin", "Funk", "Salsa", "Pop"],
  },
  Focused: {
    Workout: ["Electronic", "House", "Techno", "Drum & Bass"],
    Studying: ["Lo-fi", "Instrumental", "Ambient", "Classical"],
    Working: ["Instrumental", "Deep Focus", "Electronic", "Minimal"],
    Driving: ["Instrumental", "Post-Rock", "Electronic", "Jazz"],
    Relaxing: ["Ambient", "Classical", "Piano", "Minimal"],
    Traveling: ["Instrumental", "Electronic", "Jazz", "World"],
    Gaming: ["Synthwave", "Electronic", "Soundtrack", "Metal"],
    Cooking: ["Jazz", "Instrumental", "Classical", "Lo-fi"],
  },
  Nostalgic: {
    Workout: ["Classic Rock", "80s Pop", "Funk", "Disco"],
    Studying: ["Indie Folk", "Acoustic", "Singer-Songwriter", "Jazz"],
    Working: ["80s Pop", "Soft Rock", "Indie", "Soul"],
    Driving: ["Classic Rock", "70s Rock", "Soft Rock", "Americana"],
    Relaxing: ["Classic Rock", "Indie Folk", "80s Pop", "Acoustic"],
    Traveling: ["Classic Rock", "Folk", "Country", "World"],
    Gaming: ["Synthwave", "80s Pop", "Rock", "Soundtrack"],
    Cooking: ["Soul", "Jazz", "Classic Rock", "Blues"],
  },
  Romantic: {
    Workout: ["R&B", "Pop", "Soul", "Dance"],
    Studying: ["Indie Pop", "Acoustic", "Piano", "Jazz"],
    Working: ["Indie Pop", "Soul", "R&B", "Soft Rock"],
    Driving: ["Indie Pop", "R&B", "Soul", "Soft Rock"],
    Relaxing: ["R&B", "Soul", "Jazz", "Acoustic"],
    Traveling: ["Indie Pop", "Bossa Nova", "Jazz", "Soul"],
    Gaming: ["Indie", "Synth Pop", "R&B", "Soundtrack"],
    Cooking: ["Jazz", "Soul", "Bossa Nova", "French Pop"],
  },
  Melancholic: {
    Workout: ["Alt Rock", "Emo", "Indie Rock", "Post-Punk"],
    Studying: ["Indie Folk", "Ambient", "Classical", "Singer-Songwriter"],
    Working: ["Indie", "Ambient", "Post-Rock", "Lo-fi"],
    Driving: ["Indie Rock", "Shoegaze", "Alt", "Folk"],
    Relaxing: ["Indie Folk", "Ambient", "Singer-Songwriter", "Classical"],
    Traveling: ["Indie Folk", "Ambient", "Post-Rock", "World"],
    Gaming: ["Dark Ambient", "Post-Rock", "Soundtrack", "Indie"],
    Cooking: ["Jazz", "Blues", "Singer-Songwriter", "Folk"],
  },
  Chill: {
    Workout: ["Chill Hop", "Reggae", "Downtempo", "Lo-fi"],
    Studying: ["Lo-fi", "Chillhop", "Jazz", "Ambient"],
    Working: ["Lo-fi", "Chillhop", "Ambient", "Jazz"],
    Driving: ["Reggae", "Indie", "Lo-fi", "Soft Rock"],
    Relaxing: ["Lo-fi", "Reggae", "Downtempo", "Ambient"],
    Traveling: ["Lo-fi", "Reggae", "World", "Downtempo"],
    Gaming: ["Lo-fi", "Chillwave", "Synthwave", "Ambient"],
    Cooking: ["Jazz", "Bossa Nova", "Lo-fi", "Soul"],
  },
};

/** Returns four genre chips inferred from mood + activity (frontend-only). */
export function getPreviewGenres(
  mood: Mood | null,
  activity: Activity | null,
): readonly string[] {
  if (!mood || !activity) {
    return PLACEHOLDER_GENRES;
  }
  return GENRES_BY_MOOD_ACTIVITY[mood][activity];
}

export function hasPreviewGenres(
  mood: Mood | null,
  activity: Activity | null,
): boolean {
  return mood !== null && activity !== null;
}
