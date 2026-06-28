/**
 * Synthesized insights extracted from analysis of 183 Spotify user reviews
 * across App Store, Play Store, Reddit, Spotify Community, and social media.
 *
 * Read-only product knowledge — do not mutate at runtime.
 */

export const RESEARCH_INSIGHTS = {
  totalReviews: 183,

  topPainPoints: [
    "Recommendations feel repetitive and loop back to the same artists and playlists",
    "Discovery rarely reflects what users want to listen to right now",
    "Users hesitate to try unfamiliar tracks without a clear reason they will fit",
    "Spotify optimizes for historical taste more than present-moment intent",
    "Free-tier limits and ads interrupt exploratory listening sessions",
  ],

  unmetNeeds: [
    "Context-aware recommendations tied to mood and activity",
    "Transparent explanations for why a song was suggested",
    "A balanced mix of comfort picks and genuinely new discoveries",
    "Quick previews that reduce uncertainty before committing to a full track",
    "Discovery that stays inside Spotify instead of starting on social platforms",
  ],

  listeningBehaviors: [
    "Most daily listeners return to liked songs, saved playlists, and familiar artists",
    "Music is often background for studying, working, commuting, working out, or relaxing",
    "Many users discover songs on Instagram Reels or YouTube Shorts, then search on Spotify",
    "Repeat listening increases when recommendations feel generic or out of context",
    "Users save more tracks when they understand the connection to their current moment",
  ],

  recommendationProblems: [
    "Collaborative filtering over-indexes on past behavior and mainstream popularity",
    "Recommendation lists cluster around the same genres without enough variety",
    "New artists surface too rarely compared with already-known favorites",
    "Mood and activity context are weak signals in default recommendation feeds",
    "Skip and save feedback rarely feels like it changes future suggestions",
  ],

  discoveryGoals: [
    "Reduce recommendation fatigue by varying familiar, similar, hidden, and wildcard picks",
    "Increase meaningful discovery without sacrificing relevance to the current moment",
    "Build confidence before trying unfamiliar music through previews and explanations",
    "Learn from explicit save and skip feedback over time",
    "Keep users exploring within Spotify instead of relying on external platforms",
  ],
} as const;

/** User-facing caption for diversity-balanced recommendation mixes. */
export function buildMixBalanceCaption(): string {
  return `Balanced using insights from ${RESEARCH_INSIGHTS.totalReviews} Spotify user reviews to reduce recommendation fatigue.`;
}

/** Intro line for the research-backed discovery strategy panel. */
export function buildStrategyIntro(): string {
  return `Based on patterns identified across ${RESEARCH_INSIGHTS.totalReviews} Spotify user reviews, I'll optimize your recommendations by:`;
}

/** Phrases used when building the personalized strategy paragraph. */
export const STRATEGY_PERSONALIZATION = {
  fatigueAvoidance: "avoiding repetitive listening patterns",
  moodOnlySuffix:
    "while surfacing fresh discoveries and hidden gems you may not have heard lately",
  activityOnlySuffix:
    "while balancing familiar comfort with surprising new finds",
  artistOnlySuffix:
    "while keeping recommendations transparent and varied",
  emptyState:
    "Once you share how you're feeling and what you're up to, I'll shape recommendations around your moment—balancing comfort, surprise, and clear explanations for every pick.",
} as const;
