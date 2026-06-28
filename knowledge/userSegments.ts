/**
 * Research-backed user personas synthesized from analysis of 183 Spotify user reviews
 * across App Store, Play Store, Reddit, Spotify Community, and social media.
 *
 * Read-only product knowledge — do not mutate at runtime.
 */

export interface UserSegment {
  id: string;
  name: string;
  goals: string[];
  painPoints: string[];
  discoveryChallenges: string[];
}

export const USER_SEGMENTS = {
  freeUser: {
    id: "free-user",
    name: "Free User",
    goals: [
      "Maximize listening value without upgrading",
      "Find new music quickly between ads and shuffle limits",
      "Reuse familiar playlists that always feel safe",
    ],
    painPoints: [
      "Ads and shuffle restrictions interrupt exploratory sessions",
      "Recommendations feel repetitive within free-tier constraints",
      "Limited control over what plays next during discovery",
    ],
    discoveryChallenges: [
      "Hesitates to explore when skips and replays are constrained",
      "Defaults to liked songs instead of unfamiliar artists",
      "Needs clear reasons to try a new track before committing",
    ],
  },
  premiumUser: {
    id: "premium-user",
    name: "Premium User",
    goals: [
      "Access on-demand playback and richer discovery features",
      "Build playlists that reflect both taste and current mood",
      "Find artists ahead of mainstream trends",
    ],
    painPoints: [
      "Discovery mixes still loop familiar artists despite premium access",
      "Daily mixes and Discover Weekly feel predictable over time",
      "Context like activity or mood is rarely reflected in feeds",
    ],
    discoveryChallenges: [
      "High expectations for personalization that history alone cannot meet",
      "Wants novelty without losing relevance to the present moment",
      "Needs explanations to trust crossover or wildcard suggestions",
    ],
  },
  explorer: {
    id: "explorer",
    name: "Explorer",
    goals: [
      "Continuously expand taste across genres and regions",
      "Surface hidden gems and emerging artists early",
      "Avoid mainstream echo chambers in recommendation feeds",
    ],
    painPoints: [
      "Algorithm feeds recycle the same popular artists",
      "Wildcard picks are too rare compared with safe recommendations",
      "Social platforms beat Spotify to new music discovery",
    ],
    discoveryChallenges: [
      "Fatigue sets in when lists lack genuine surprise",
      "Needs diversity without random irrelevant suggestions",
      "Values transparent reasoning for adventurous picks",
    ],
  },
  comfortListener: {
    id: "comfort-listener",
    name: "Comfort Listener",
    goals: [
      "Stay within a trusted sonic palette during daily routines",
      "Add gentle variation without jarring genre shifts",
      "Use music as reliable background for work or relaxation",
    ],
    painPoints: [
      "Unfamiliar recommendations feel risky without preview or context",
      "Sudden genre jumps break focus during study or work sessions",
      "Repeat playlists feel safer than algorithmic discovery",
    ],
    discoveryChallenges: [
      "Needs familiar anchors before accepting new artists",
      "Skips aggressively when picks mismatch current activity",
      "Benefits from gradual exploration rather than bold wildcards first",
    ],
  },
  focusedListener: {
    id: "focused-listener",
    name: "Focused Listener",
    goals: [
      "Maintain concentration during study, work, or deep tasks",
      "Match tempo and energy to the activity without distraction",
      "Discover instrumentals and steady grooves that support focus",
    ],
    painPoints: [
      "Lyric-heavy or high-variance picks break concentration",
      "Recommendations ignore whether the user is working or relaxing",
      "Repetitive focus playlists reduce long-term engagement",
    ],
    discoveryChallenges: [
      "Needs context-aware curation more than genre breadth alone",
      "Prefers explainable picks that fit the task at hand",
      "Save feedback should reinforce productive listening patterns",
    ],
  },
} as const satisfies Record<string, UserSegment>;

export type UserSegmentKey = keyof typeof USER_SEGMENTS;

/** Infer the closest persona from discovery context for strategy personalization. */
export function inferUserSegment(
  mood: string | null,
  activity: string | null,
): UserSegment {
  const normalizedActivity = activity?.toLowerCase() ?? "";

  if (
    normalizedActivity === "studying" ||
    normalizedActivity === "working" ||
    mood === "Focused"
  ) {
    return USER_SEGMENTS.focusedListener;
  }

  if (
    mood === "Calm" ||
    mood === "Chill" ||
    normalizedActivity === "relaxing"
  ) {
    return USER_SEGMENTS.comfortListener;
  }

  if (
    mood === "Energetic" ||
    mood === "Happy" ||
    normalizedActivity === "traveling" ||
    normalizedActivity === "gaming"
  ) {
    return USER_SEGMENTS.explorer;
  }

  return USER_SEGMENTS.premiumUser;
}
