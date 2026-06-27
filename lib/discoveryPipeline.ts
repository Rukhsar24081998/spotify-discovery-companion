/**
 * Visual pipeline stages mapped to the real /api/discover orchestration
 * (see app/api/discover/route.ts). Presentation-only — no backend changes.
 */

export interface PipelineStage {
  id: string;
  label: string;
  message: string;
  /** Documents which backend step this stage represents (for dev clarity). */
  backendStep: string;
}

export const DISCOVERY_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "understand",
    label: "Understanding your request",
    message: "Understanding your music preferences...",
    backendStep: "validateDiscoverInput — context assembly",
  },
  {
    id: "plan",
    label: "Generating intelligent Spotify searches",
    message: "Generating intelligent Spotify searches from your mood and activity...",
    backendStep: "generatePlan — Groq planning call",
  },
  {
    id: "search",
    label: "Searching Spotify",
    message: "Searching Spotify for strong candidates...",
    backendStep: "searchTracks — Spotify Web API",
  },
  {
    id: "collect",
    label: "Collecting candidate tracks",
    message: "Collecting and deduplicating candidate tracks...",
    backendStep: "dedupeByTrackId + broadenSearchQuery fallback",
  },
  {
    id: "rank",
    label: "AI reasoning and ranking",
    message: "Analyzing musical patterns...",
    backendStep: "rankCandidates — Groq ranking call",
  },
  {
    id: "compose",
    label: "Building personalized recommendations",
    message: "Ranking recommendations using AI...",
    backendStep: "reconcileRanking + composeRecommendations",
  },
  {
    id: "finalize",
    label: "Finalizing results",
    message: "Preparing your personalized discovery...",
    backendStep: "DiscoverResponse assembly",
  },
];

/** Max stage index shown while waiting for the real API response. */
export const PIPELINE_MAX_STAGE_WHILE_PENDING = 3;
