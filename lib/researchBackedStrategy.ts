import type { Activity, Mood } from "@/types";
import { STRATEGY_PRINCIPLE_SUMMARIES } from "@/knowledge/discoveryPrinciples";
import {
  buildStrategyIntro,
  RESEARCH_INSIGHTS,
  STRATEGY_PERSONALIZATION,
} from "@/knowledge/researchInsights";
import { inferUserSegment } from "@/knowledge/userSegments";

/** @deprecated Use STRATEGY_PRINCIPLE_SUMMARIES from knowledge/discoveryPrinciples */
export const RESEARCH_STRATEGY_PRINCIPLES = STRATEGY_PRINCIPLE_SUMMARIES;

/** @deprecated Use RESEARCH_INSIGHTS.totalReviews from knowledge/researchInsights */
export const RESEARCH_REVIEW_COUNT = RESEARCH_INSIGHTS.totalReviews;

const STRATEGY_PRIORITIES: Record<Mood, Record<Activity, string>> = {
  Happy: {
    Workout: "energetic pop, feel-good anthems and motivating hidden gems",
    Studying: "bright indie, light funk and focus-friendly upbeat tracks",
    Working: "optimistic pop, indie energy and steady motivational grooves",
    Driving: "singalong pop, indie road-trip vibes and sunny discoveries",
    Relaxing: "warm indie pop, soft soul and easygoing feel-good tracks",
    Traveling: "uplifting indie pop, acoustic road-trip music and emotionally rich discoveries",
    Gaming: "upbeat electronic, playful hip-hop and high-energy indie",
    Cooking: "feel-good soul, bossa-nova warmth and joyful kitchen grooves",
  },
  Calm: {
    Workout: "gentle yoga beats, soft downtempo and mindful movement music",
    Studying: "lo-fi calm, acoustic piano and ambient focus textures",
    Working: "quiet ambient, piano-led instrumentals and minimal deep focus",
    Driving: "soft rock, indie folk and unhurried scenic soundscapes",
    Relaxing: "ambient calm, acoustic ease and restorative quiet moments",
    Traveling: "gentle acoustic, world-inspired calm and peaceful journey music",
    Gaming: "ambient soundtracks, mellow lo-fi and low-key immersive moods",
    Cooking: "soft jazz, acoustic soul and relaxed culinary rhythms",
  },
  Energetic: {
    Workout: "high-energy EDM, hip-hop drive and punchy rock adrenaline",
    Studying: "upbeat pop, funk momentum and lively but controlled focus",
    Working: "propulsive house, energetic pop and productive momentum",
    Driving: "bold rock, driving EDM and highway-ready intensity",
    Relaxing: "dance-pop warmth, disco grooves and upbeat unwinding",
    Traveling: "vibrant pop, Latin energy and adventure-ready anthems",
    Gaming: "heavy EDM, metal edge and adrenaline-fueled soundtracks",
    Cooking: "Latin funk, salsa heat and lively kitchen energy",
  },
  Focused: {
    Workout: "steady electronic, house precision and rhythm-driven focus",
    Studying: "instrumental lo-fi, classical clarity and distraction-free calm",
    Working: "deep-focus instrumentals, minimal electronic and steady tempo",
    Driving: "instrumental post-rock, electronic flow and clear-headed motion",
    Relaxing: "ambient classical, piano stillness and gentle mental reset",
    Traveling: "instrumental jazz, electronic drift and mindful movement",
    Gaming: "synthwave focus, cinematic electronic and immersive precision",
    Cooking: "instrumental jazz, classical ease and measured kitchen flow",
  },
  Nostalgic: {
    Workout: "classic rock energy, 80s pop drive and retro-funk momentum",
    Studying: "indie folk memory, acoustic storytelling and warm vintage tones",
    Working: "80s pop comfort, soft rock familiarity and reflective focus",
    Driving: "classic rock, 70s road anthems and Americana storytelling",
    Relaxing: "classic rock ease, indie folk warmth and timeless acoustic comfort",
    Traveling: "folk nostalgia, classic journeys and sentimental road memories",
    Gaming: "synthwave throwbacks, 80s rock and retro game-night moods",
    Cooking: "soul classics, jazz nostalgia and familiar kitchen comfort",
  },
  Romantic: {
    Workout: "soulful R&B, romantic pop and emotionally charged movement",
    Studying: "indie pop intimacy, acoustic piano and tender focus",
    Working: "soft R&B, indie soul and emotionally balanced productivity",
    Driving: "indie pop romance, soulful R&B and cinematic night drives",
    Relaxing: "R&B warmth, soul intimacy and slow-burning connection",
    Traveling: "indie pop romance, bossa-nova charm and wanderlust intimacy",
    Gaming: "indie soundtracks, synth-pop romance and moody immersion",
    Cooking: "jazz romance, soulful bossa nova and intimate dining moods",
  },
  Melancholic: {
    Workout: "alt-rock release, emo catharsis and intense emotional movement",
    Studying: "indie folk depth, ambient reflection and thoughtful solitude",
    Working: "indie introspection, ambient post-rock and contemplative focus",
    Driving: "indie rock emotion, shoegaze haze and reflective open roads",
    Relaxing: "indie folk tenderness, ambient sadness and gentle emotional space",
    Traveling: "indie folk wanderings, ambient depth and bittersweet journeys",
    Gaming: "dark ambient, post-rock emotion and immersive melancholy",
    Cooking: "blues warmth, folk storytelling and soulful quiet cooking",
  },
  Chill: {
    Workout: "chill-hop groove, reggae ease and low-key rhythmic movement",
    Studying: "lo-fi chill, jazz haze and relaxed concentration",
    Working: "chillhop flow, ambient jazz and unforced productivity",
    Driving: "reggae ease, indie chill and laid-back scenic drives",
    Relaxing: "lo-fi unwind, reggae calm and effortless downtime",
    Traveling: "downtempo world grooves, reggae drift and easy exploration",
    Gaming: "chillwave immersion, lo-fi soundscapes and mellow focus",
    Cooking: "bossa nova ease, lo-fi soul and unhurried kitchen vibes",
  },
};

function formatArtistClause(favoriteArtists: string[]): string {
  if (favoriteArtists.length === 0) {
    return "";
  }
  if (favoriteArtists.length === 1) {
    return ` with ${favoriteArtists[0]} as inspiration`;
  }
  const last = favoriteArtists[favoriteArtists.length - 1];
  const rest = favoriteArtists.slice(0, -1).join(", ");
  return ` with ${rest}, and ${last} as inspiration`;
}

function getPriorities(mood: Mood, activity: Activity): string {
  return STRATEGY_PRIORITIES[mood][activity];
}

function buildPersonalizedParagraph(
  mood: Mood | null,
  activity: Activity | null,
  favoriteArtists: string[],
): string {
  const artistClause = formatArtistClause(favoriteArtists);

  if (mood && activity) {
    return `Since you're feeling ${mood} and ${activity}${artistClause}, I'll prioritize ${getPriorities(mood, activity)} while ${STRATEGY_PERSONALIZATION.fatigueAvoidance}.`;
  }

  if (mood) {
    return `Since you're feeling ${mood}${artistClause}, I'll prioritize music that matches that mood ${STRATEGY_PERSONALIZATION.moodOnlySuffix}.`;
  }

  if (activity) {
    return `Since you're ${activity.toLowerCase()}${artistClause}, I'll prioritize music that fits the moment ${STRATEGY_PERSONALIZATION.activityOnlySuffix}.`;
  }

  if (favoriteArtists.length > 0) {
    return `Drawing on ${favoriteArtists.join(", ")} as inspiration, I'll explore adjacent artists and hidden gems that share that sensibility ${STRATEGY_PERSONALIZATION.artistOnlySuffix}.`;
  }

  return STRATEGY_PERSONALIZATION.emptyState;
}

export interface ResearchBackedStrategy {
  intro: string;
  principles: readonly string[];
  personalizedParagraph: string;
  wordCount: number;
  /** Research-backed persona inferred from mood and activity context. */
  inferredSegment: string;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Builds a conversational, research-backed discovery strategy from user
 * selections. Consumes the read-only knowledge layer — no LLM or backend.
 */
export function buildResearchBackedStrategy(
  mood: Mood | null,
  activity: Activity | null,
  favoriteArtists: string[],
): ResearchBackedStrategy {
  const intro = buildStrategyIntro();
  const principles = STRATEGY_PRINCIPLE_SUMMARIES;
  const personalizedParagraph = buildPersonalizedParagraph(
    mood,
    activity,
    favoriteArtists,
  );

  const fullText = [intro, ...principles, personalizedParagraph].join(" ");
  const wordCount = countWords(fullText);

  return {
    intro,
    principles,
    personalizedParagraph,
    wordCount,
    inferredSegment: inferUserSegment(mood, activity).name,
  };
}
