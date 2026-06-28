import type { Activity, Mood } from "@/types";

const MOOD_FOCUS: Record<Mood, string> = {
  Happy: "uplifting melodies and feel-good rhythms",
  Calm: "soft acoustic textures and relaxing instrumentals",
  Energetic: "high-energy tracks, motivational anthems, and upbeat music with strong momentum",
  Focused: "steady tempos and minimal distractions",
  Nostalgic: "familiar sounds and timeless tracks with emotional depth",
  Romantic: "warm, intimate tones and emotionally rich songwriting",
  Melancholic: "reflective moods and emotionally resonant soundscapes",
  Chill: "laid-back grooves and easy-going atmosphere",
};

const ACTIVITY_FOCUS: Record<Activity, string> = {
  Workout: "driving beats and energizing momentum",
  Studying: "focused, low-friction listening",
  Working: "background-friendly tracks that stay out of the way",
  Driving: "forward-moving grooves and confident energy",
  Relaxing: "easy-going pacing and warm atmosphere",
  Traveling: "versatile tracks that keep the journey feeling fresh",
  Gaming: "immersive energy and steady momentum",
  Cooking: "feel-good rhythms that match a creative, hands-on moment",
};

/** Client-side summary copy derived from the user's selected context. */
export function buildAiSummaryExplanation(mood: Mood, activity: Activity): string {
  const moodFocus = MOOD_FOCUS[mood];
  const activityFocus = ACTIVITY_FOCUS[activity];

  return `Based on your ${mood.toLowerCase()} mood and ${activity.toLowerCase()} activity, the AI prioritized ${moodFocus}, shaped for ${activityFocus}.`;
}

export function formatRecommendationCount(count: number): string {
  if (count === 1) {
    return "1 personalized recommendation";
  }
  return `${count} personalized recommendations`;
}

export function formatRecommendationCountPill(count: number): string {
  if (count === 1) {
    return "1 Recommendation";
  }
  return `${count} Recommendations`;
}
