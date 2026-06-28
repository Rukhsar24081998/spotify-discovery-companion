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
    id: "mood",
    label: "Analyzing your mood",
    message: "Analyzing your mood...",
    backendStep: "validateDiscoverInput — context assembly",
  },
  {
    id: "activity",
    label: "Understanding activity",
    message: "Understanding activity...",
    backendStep: "generatePlan — Groq planning call",
  },
  {
    id: "search",
    label: "Searching Spotify",
    message: "Searching Spotify...",
    backendStep: "searchTracks — Spotify Web API",
  },
  {
    id: "rank",
    label: "Ranking candidates",
    message: "Ranking candidates...",
    backendStep: "rankCandidates — Groq ranking call",
  },
  {
    id: "explain",
    label: "Generating explanations",
    message: "Generating explanations...",
    backendStep: "reconcileRanking + composeRecommendations",
  },
  {
    id: "prepare",
    label: "Preparing recommendations",
    message: "Preparing recommendations...",
    backendStep: "DiscoverResponse assembly",
  },
];

/** Max stage index shown while waiting for the real API response. */
export const PIPELINE_MAX_STAGE_WHILE_PENDING = 2;
