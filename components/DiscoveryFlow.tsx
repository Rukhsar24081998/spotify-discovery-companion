"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Activity,
  CandidateTrack,
  DiscoverRequest,
  DiscoverResponse,
  DiscoveryMeta,
  ErrorResponse,
  FeedbackReason,
  FeedbackRequest,
  FeedbackResponse,
  Mood,
  Recommendation,
} from "@/types";
import { Heading } from "@/components/ui/Heading";
import { MoodSelector } from "@/components/MoodSelector";
import { ActivitySelector } from "@/components/ActivitySelector";
import { ArtistSearch } from "@/components/ArtistSearch";
import { LoadingState } from "@/components/LoadingState";
import { RecommendationCard } from "@/components/RecommendationCard";
import { FeedbackDialog } from "@/components/FeedbackDialog";

type FlowPhase = "input" | "loading" | "results";

const MIN_LOADING_MS = 1750;
const SKIP_EXIT_MS = 300;

const DEFAULT_ERROR_MESSAGE = "Please try again in a moment.";
/** Truthy sentinel — LoadingState shows fixed copy, not this string. */
const SERVICE_ERROR_FLAG = "service-error";

/** Client-held session payload for Phase 11 feedback replay. */
interface DiscoverySession {
  discoverRequest: DiscoverRequest;
  candidatePool: CandidateTrack[];
  shownTrackIds: string[];
  skippedTrackIds: string[];
  skipCount: number;
  skipsSinceFeedback: number;
}

function buildDiscoverRequest(
  mood: Mood | null,
  activity: Activity | null,
  favoriteArtists: string[],
): DiscoverRequest | null {
  if (!mood || !activity) {
    return null;
  }
  return favoriteArtists.length > 0
    ? { mood, activity, favoriteArtists }
    : { mood, activity };
}

function buildResultsSubtitle(mood: Mood, activity: Activity): string {
  return `AI-curated for your ${mood.toLowerCase()} mood while ${activity.toLowerCase()}.`;
}

async function fetchDiscover(request: DiscoverRequest): Promise<DiscoverResponse> {
  let response: Response;
  try {
    response = await fetch("/api/discover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }

  let data: DiscoverResponse | ErrorResponse;
  try {
    data = (await response.json()) as DiscoverResponse | ErrorResponse;
  } catch {
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }

  if ("error" in data) {
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }

  return data;
}

async function fetchFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
  let response: Response;
  try {
    response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }

  let data: FeedbackResponse | ErrorResponse;
  try {
    data = (await response.json()) as FeedbackResponse | ErrorResponse;
  } catch {
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }

  if ("error" in data) {
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }

  return data;
}

/**
 * Discovery Companion flow (Screens 2–4). Collects context, calls /api/discover,
 * and renders recommendation cards.
 */
export function DiscoveryFlow() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>([]);
  const [phase, setPhase] = useState<FlowPhase>("input");

  const [discoverRequest, setDiscoverRequest] = useState<DiscoverRequest | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [meta, setMeta] = useState<DiscoveryMeta | null>(null);
  const [savedTrackIds, setSavedTrackIds] = useState<Set<string>>(new Set());
  const [exitingTrackIds, setExitingTrackIds] = useState<Set<string>>(new Set());
  const [activePreviewTrackId, setActivePreviewTrackId] = useState<string | null>(null);

  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackSelectedReason, setFeedbackSelectedReason] = useState<FeedbackReason | null>(
    null,
  );
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [fetchComplete, setFetchComplete] = useState(false);
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);

  const pendingResponseRef = useRef<DiscoverResponse | null>(null);
  const pendingRequestRef = useRef<DiscoverRequest | null>(null);
  const minLoadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const sessionRef = useRef<DiscoverySession | null>(null);
  const feedbackSubmittingRef = useRef(false);

  const canSubmit = mood !== null && activity !== null;

  const applyDiscoverResponse = useCallback(
    (response: DiscoverResponse, request: DiscoverRequest) => {
      setDiscoverRequest(request);
      setRecommendations(response.recommendations);
      setMeta(response.meta);
      setSavedTrackIds(new Set());
      setExitingTrackIds(new Set());
      setActivePreviewTrackId(null);
      setFeedbackDialogOpen(false);
      setFeedbackSelectedReason(null);
      setFeedbackSubmitting(false);
      setFeedbackError(null);
      feedbackSubmittingRef.current = false;

      sessionRef.current = {
        discoverRequest: request,
        candidatePool: response.candidatePool,
        shownTrackIds: response.recommendations.map((rec) => rec.trackId),
        skippedTrackIds: [],
        skipCount: 0,
        skipsSinceFeedback: 0,
      };
    },
    [],
  );

  const runDiscover = useCallback(async (request: DiscoverRequest) => {
    if (minLoadingTimerRef.current) {
      clearTimeout(minLoadingTimerRef.current);
    }

    setPhase("loading");
    setLoadingError(null);
    setFetchComplete(false);
    setMinLoadingComplete(false);
    pendingResponseRef.current = null;
    pendingRequestRef.current = request;

    minLoadingTimerRef.current = setTimeout(() => {
      setMinLoadingComplete(true);
    }, MIN_LOADING_MS);

    try {
      const response = await fetchDiscover(request);
      pendingResponseRef.current = response;
      setFetchComplete(true);
    } catch {
      if (minLoadingTimerRef.current) {
        clearTimeout(minLoadingTimerRef.current);
      }
      setLoadingError(SERVICE_ERROR_FLAG);
      setFetchComplete(true);
      setMinLoadingComplete(true);
    }
  }, []);

  useEffect(() => {
    if (phase !== "loading" || loadingError) {
      return;
    }
    if (!fetchComplete || !minLoadingComplete) {
      return;
    }
    const response = pendingResponseRef.current;
    const request = pendingRequestRef.current;
    if (!response || !request) {
      return;
    }

    applyDiscoverResponse(response, request);
    pendingResponseRef.current = null;
    setPhase("results");
  }, [phase, loadingError, fetchComplete, minLoadingComplete, applyDiscoverResponse]);

  useEffect(() => {
    const skipTimers = skipTimersRef.current;
    return () => {
      if (minLoadingTimerRef.current) {
        clearTimeout(minLoadingTimerRef.current);
      }
      skipTimers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  function handleSubmit() {
    const request = buildDiscoverRequest(mood, activity, favoriteArtists);
    if (!request) {
      return;
    }
    void runDiscover(request);
  }

  function handleRetry() {
    const request = pendingRequestRef.current ?? discoverRequest ?? buildDiscoverRequest(mood, activity, favoriteArtists);
    if (request) {
      void runDiscover(request);
    }
  }

  function handleAdjustInput() {
    setActivePreviewTrackId(null);
    setPhase("input");
    setLoadingError(null);
  }

  function handlePreviewActivate(trackId: string) {
    setActivePreviewTrackId(trackId);
  }

  function handlePreviewDeactivate(trackId: string) {
    setActivePreviewTrackId((current) => (current === trackId ? null : current));
  }

  function handleSave(trackId: string) {
    setSavedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }

  function handleSkip(trackId: string) {
    if (exitingTrackIds.has(trackId)) {
      return;
    }

    if (activePreviewTrackId === trackId) {
      setActivePreviewTrackId(null);
    }

    setExitingTrackIds((prev) => new Set(prev).add(trackId));

    const timer = setTimeout(() => {
      setRecommendations((prev) => prev.filter((rec) => rec.trackId !== trackId));
      setExitingTrackIds((prev) => {
        const next = new Set(prev);
        next.delete(trackId);
        return next;
      });

      if (sessionRef.current) {
        const skipsSinceFeedback = sessionRef.current.skipsSinceFeedback + 1;
        sessionRef.current = {
          ...sessionRef.current,
          shownTrackIds: sessionRef.current.shownTrackIds.filter((id) => id !== trackId),
          skippedTrackIds: [...sessionRef.current.skippedTrackIds, trackId],
          skipCount: sessionRef.current.skipCount + 1,
          skipsSinceFeedback,
        };

        if (skipsSinceFeedback === 2) {
          setFeedbackSelectedReason(null);
          setFeedbackError(null);
          setFeedbackDialogOpen(true);
        }
      }

      skipTimersRef.current.delete(trackId);
    }, SKIP_EXIT_MS);

    skipTimersRef.current.set(trackId, timer);
  }

  function handleFeedbackDismiss() {
    if (feedbackSubmitting) {
      return;
    }
    setFeedbackDialogOpen(false);
    setFeedbackSelectedReason(null);
    setFeedbackError(null);
    if (sessionRef.current) {
      sessionRef.current = { ...sessionRef.current, skipsSinceFeedback: 0 };
    }
  }

  async function handleFeedbackSubmit() {
    if (
      feedbackSubmittingRef.current ||
      feedbackSubmitting ||
      !feedbackSelectedReason ||
      !sessionRef.current
    ) {
      return;
    }

    feedbackSubmittingRef.current = true;
    setFeedbackSubmitting(true);
    setFeedbackError(null);

    const session = sessionRef.current;
    const payload: FeedbackRequest = {
      context: session.discoverRequest,
      candidatePool: session.candidatePool,
      shownTrackIds: session.shownTrackIds,
      skippedTrackIds: session.skippedTrackIds,
      reasons: [feedbackSelectedReason],
    };

    try {
      const response = await fetchFeedback(payload);
      setActivePreviewTrackId(null);
      setRecommendations(response.recommendations);
      setMeta(response.meta);
      sessionRef.current = {
        ...session,
        candidatePool: response.candidatePool,
        shownTrackIds: response.recommendations.map((rec) => rec.trackId),
        skipsSinceFeedback: 0,
      };
      setFeedbackDialogOpen(false);
      setFeedbackSelectedReason(null);
    } catch {
      setFeedbackError(SERVICE_ERROR_FLAG);
    } finally {
      feedbackSubmittingRef.current = false;
      setFeedbackSubmitting(false);
    }
  }

  if (phase === "loading") {
    return <LoadingState error={loadingError} onRetry={handleRetry} />;
  }

  if (phase === "results" && discoverRequest && meta) {
    const { mood: resultMood, activity: resultActivity } = discoverRequest;

    if (recommendations.length === 0) {
      return (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col gap-2">
            <Heading level={1}>Your Discoveries</Heading>
            <p className="text-body text-white/70">
              We couldn&apos;t find a great match right now.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAdjustInput}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-6 py-3 text-support font-semibold text-black transition-colors duration-150 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Adjust mood &amp; activity
            </button>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/20 px-6 py-3 text-support font-medium text-white transition-colors duration-150 motion-reduce:transition-none hover:border-white/40 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col gap-8 animate-fade-in">
          <div className="flex flex-col gap-2">
            <Heading level={1}>Your Discoveries</Heading>
            <p className="text-body text-white/60">
              {buildResultsSubtitle(resultMood, resultActivity)}
            </p>
          </div>

          {meta.limited && (
            <div
              role="status"
              className="flex flex-col gap-1 rounded-xl border border-white/10 bg-surface px-4 py-3 text-body text-white/70"
            >
              <p>We found a few matches for now.</p>
              <p>Try adjusting your mood or activity for more.</p>
            </div>
          )}

          <ul className="flex flex-col gap-6" aria-label="Recommendations">
            {recommendations.map((recommendation) => (
              <li key={recommendation.trackId} className="list-none">
                <RecommendationCard
                  recommendation={recommendation}
                  isSaved={savedTrackIds.has(recommendation.trackId)}
                  isExiting={exitingTrackIds.has(recommendation.trackId)}
                  isPreviewActive={activePreviewTrackId === recommendation.trackId}
                  onPreviewActivate={handlePreviewActivate}
                  onPreviewDeactivate={handlePreviewDeactivate}
                  onSave={() => handleSave(recommendation.trackId)}
                  onSkip={() => handleSkip(recommendation.trackId)}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleAdjustInput}
            className="inline-flex w-fit items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-support text-white/70 transition-colors duration-150 motion-reduce:transition-none hover:border-white/40 hover:bg-surface-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Start a new discovery
          </button>
        </div>

        <FeedbackDialog
          open={feedbackDialogOpen}
          selectedReason={feedbackSelectedReason}
          onSelectReason={setFeedbackSelectedReason}
          onDismiss={handleFeedbackDismiss}
          onSubmit={() => void handleFeedbackSubmit()}
          submitting={feedbackSubmitting}
          error={feedbackError}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Heading level={1}>Let&apos;s find something you&apos;ll love.</Heading>

      <MoodSelector value={mood} onChange={setMood} />
      <hr className="border-white/10" />
      <ActivitySelector value={activity} onChange={setActivity} />
      <hr className="border-white/10" />
      <ArtistSearch value={favoriteArtists} onChange={setFavoriteArtists} />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-body font-semibold text-black transition-colors duration-150 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-white/50 sm:w-auto sm:self-start"
      >
        Discover Music
      </button>
    </div>
  );
}
