import type { Activity, Mood } from "@/types";

/** Spotify-style chip labels for the discovery input form. */
export const MOOD_CHIP_LABELS: Record<Mood, string> = {
  Happy: "😊 Happy",
  Calm: "😌 Calm",
  Energetic: "⚡ Energetic",
  Focused: "🎯 Focused",
  Nostalgic: "🌅 Nostalgic",
  Romantic: "❤️ Romantic",
  Melancholic: "🌧 Melancholic",
  Chill: "😎 Chill",
};

export const ACTIVITY_CHIP_LABELS: Record<Activity, string> = {
  Workout: "🏋️ Workout",
  Studying: "📚 Studying",
  Working: "💻 Working",
  Driving: "🚗 Driving",
  Relaxing: "🛋 Relaxing",
  Traveling: "✈️ Traveling",
  Gaming: "🎮 Gaming",
  Cooking: "🍳 Cooking",
};

export function getDiscoverHelperMessage(
  mood: Mood | null,
  activity: Activity | null,
): string {
  if (mood && activity) {
    return "You're ready. Optionally add an artist for even better recommendations.";
  }
  if (mood) {
    return "Great! Now choose your activity.";
  }
  return "Choose your mood and activity to begin.";
}
