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
import { ACTIVITIES, MOODS } from "@/types";
import { consumeDiscoverMoodPrefill } from "@/lib/discoverMoodPrefill";
import { isMood } from "@/lib/utils";
import { useMyLibrary } from "@/components/layout/MyLibraryContext";
import { Heading } from "@/components/ui/Heading";
import {
  INITIAL_VISIBLE_RECOMMENDATIONS,
  LOAD_MORE_RECOMMENDATIONS_BATCH,
  RECOMMENDATION_STAGGER_MS,
} from "@/components/discover/resultsConstants";
import { DiscoverySummaryCard } from "@/components/discover/DiscoverySummaryCard";
import { formatRecommendationCount } from "@/components/discover/discoverySummary";
import { RecommendationSuccessBanner } from "@/components/discover/RecommendationSuccessBanner";
import { DiscoverEmptyState } from "@/components/discover/DiscoverEmptyState";
import { DiscoveryHero } from "@/components/discover/DiscoveryHero";
import { getDiscoverHelperMessage } from "@/components/discover/discoveryInputOptions";
import { MoodSelector } from "@/components/MoodSelector";
import { ActivitySelector } from "@/components/ActivitySelector";
import { ArtistSearch } from "@/components/ArtistSearch";
import { LoadingState } from "@/components/LoadingState";
import { RecommendationCard } from "@/components/RecommendationCard";
import { FeedbackDialog } from "@/components/FeedbackDialog";

type FlowPhase = "input" | "loading" | "results";

export type DiscoveryFlowPhase = FlowPhase;

interface DiscoveryFlowProps {
  /** Notifies the parent when the visible flow phase changes (presentation layer only). */
  onPhaseChange?: (phase: FlowPhase) => void;
}

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
export function DiscoveryFlow({ onPhaseChange }: DiscoveryFlowProps = {}) {
  const { isSaved, toggleSave } = useMyLibrary();
  const [mood, setMood] = useState<Mood | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>([]);
  const [phase, setPhase] = useState<FlowPhase>("input");

  const [discoverRequest, setDiscoverRequest] = useState<DiscoverRequest | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [meta, setMeta] = useState<DiscoveryMeta | null>(null);
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
  const [visibleRecommendationCount, setVisibleRecommendationCount] = useState(
    INITIAL_VISIBLE_RECOMMENDATIONS,
  );

  const pendingResponseRef = useRef<DiscoverResponse | null>(null);
  const pendingRequestRef = useRef<DiscoverRequest | null>(null);
  const minLoadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const sessionRef = useRef<DiscoverySession | null>(null);
  const feedbackSubmittingRef = useRef(false);
  const surpriseMeLockRef = useRef(false);

  const canSubmit = mood !== null && activity !== null;
  const isDiscovering = phase === "loading";

  useEffect(() => {
    const prefill = consumeDiscoverMoodPrefill();
    if (isMood(prefill)) {
      setMood(prefill);
    }
  }, []);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  useEffect(() => {
    setVisibleRecommendationCount(INITIAL_VISIBLE_RECOMMENDATIONS);
  }, [recommendations]);

  const applyDiscoverResponse = useCallback(
    (response: DiscoverResponse, request: DiscoverRequest) => {
      setDiscoverRequest(request);
      setRecommendations(response.recommendations);
      setMeta(response.meta);
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

  useEffect(() => {
    if (phase === "input") {
      surpriseMeLockRef.current = false;
    }
  }, [phase]);

  function startDiscover(selectedMood: Mood, selectedActivity: Activity) {
    setMood(selectedMood);
    setActivity(selectedActivity);

    const request = buildDiscoverRequest(selectedMood, selectedActivity, favoriteArtists);
    if (!request) {
      return;
    }
    void runDiscover(request);
  }

  function handleSubmit() {
    if (!mood || !activity) {
      return;
    }
    startDiscover(mood, activity);
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

  function handleSave(recommendation: Recommendation) {
    toggleSave(recommendation);
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
    return (
      <LoadingState
        error={loadingError}
        onRetry={handleRetry}
        fetchComplete={fetchComplete}
        mood={mood}
        activity={activity}
        favoriteArtists={favoriteArtists}
      />
    );
  }

  if (phase === "results" && discoverRequest && meta) {
    const { mood: resultMood, activity: resultActivity } = discoverRequest;

    if (recommendations.length === 0) {
      return (
        <div className="flex flex-col gap-8 animate-fade-in">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              Your discoveries
            </p>
            <Heading level={1}>No matches yet</Heading>
            <p className="max-w-xl text-body leading-relaxed text-white/60">
              We couldn&apos;t find a great match right now. Try adjusting your mood or activity.
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

    const visibleRecommendations = recommendations.slice(0, visibleRecommendationCount);
    const hasMoreRecommendations = recommendations.length > visibleRecommendationCount;

    return (
      <>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5 animate-fade-in">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              Your discoveries
            </p>
            <Heading level={1}>Here&apos;s what we found</Heading>
            <p className="text-support text-white/50">
              {formatRecommendationCount(recommendations.length)}
            </p>
          </div>

          <DiscoverySummaryCard
            mood={resultMood}
            activity={resultActivity}
            recommendationCount={recommendations.length}
          />

          {meta.limited && (
            <div
              role="status"
              className="flex flex-col gap-1 rounded-xl border border-white/10 bg-surface px-4 py-3 text-body text-white/70 animate-fade-in"
            >
              <p>We found a few matches for now.</p>
              <p>Try adjusting your mood or activity for more.</p>
            </div>
          )}

          <RecommendationSuccessBanner count={recommendations.length} />

          <ul className="flex flex-col gap-4" aria-label="Recommendations">
            {visibleRecommendations.map((recommendation, index) => (
              <li
                key={recommendation.trackId}
                className="list-none motion-reduce:animate-none animate-fade-in"
                style={{ animationDelay: `${index * RECOMMENDATION_STAGGER_MS}ms` }}
              >
                <RecommendationCard
                  recommendation={recommendation}
                  isSaved={isSaved(recommendation.trackId)}
                  isExiting={exitingTrackIds.has(recommendation.trackId)}
                  isPreviewActive={activePreviewTrackId === recommendation.trackId}
                  onPreviewActivate={handlePreviewActivate}
                  onPreviewDeactivate={handlePreviewDeactivate}
                  onSave={() => handleSave(recommendation)}
                  onSkip={() => handleSkip(recommendation.trackId)}
                  contextMood={resultMood}
                  contextActivity={resultActivity}
                />
              </li>
            ))}
          </ul>

          {hasMoreRecommendations && (
            <button
              type="button"
              onClick={() =>
                setVisibleRecommendationCount((count) =>
                  Math.min(count + LOAD_MORE_RECOMMENDATIONS_BATCH, recommendations.length),
                )
              }
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-white/20 px-6 py-3 text-support font-semibold text-white transition-colors duration-150 motion-reduce:transition-none hover:border-white/40 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto sm:self-center"
            >
              Load More Recommendations
            </button>
          )}

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

  function scrollToForm() {
    document.getElementById("discover-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSurpriseMe() {
    if (surpriseMeLockRef.current || isDiscovering) {
      return;
    }

    surpriseMeLockRef.current = true;

    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const randomActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
    startDiscover(randomMood, randomActivity);
  }

  return (
    <div className="mb-10 flex flex-col gap-10 lg:gap-12">
      <DiscoveryHero onGetStarted={scrollToForm} />

      <div id="discover-form" className="scroll-mt-28 flex flex-col gap-8 sm:gap-10">
        <MoodSelector value={mood} onChange={setMood} />

        <ActivitySelector value={activity} onChange={setActivity} />

        <section
          aria-labelledby="artists-step-label"
          className="rounded-xl border border-white/[0.06] bg-[#181818]/80 p-5 sm:p-6"
        >
          <p
            id="artists-step-label"
            className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
          >
            Step 3 of 3 — Optional
          </p>
          <p className="mb-4 text-sm text-white/50">
            Adding artists is optional but helps personalize your recommendations even more.
          </p>
          <ArtistSearch value={favoriteArtists} onChange={setFavoriteArtists} />
        </section>

        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isDiscovering}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-accent px-8 py-3.5 text-body font-bold text-black shadow-[0_4px_20px_rgba(29,185,84,0.35)] transition-all duration-200 ease-out motion-reduce:transition-none hover:bg-accent-hover hover:shadow-[0_6px_24px_rgba(29,185,84,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-white/50 disabled:shadow-none sm:w-auto"
            >
              Discover Music
            </button>
            <button
              type="button"
              onClick={handleSurpriseMe}
              disabled={isDiscovering}
              aria-busy={isDiscovering}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/25 bg-transparent px-8 py-3.5 text-body font-semibold text-white transition-all duration-200 ease-out motion-reduce:transition-none hover:border-white/40 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/35 sm:w-auto"
            >
              ✨ Surprise Me
            </button>
          </div>
          <p className="text-support text-white/45" aria-live="polite">
            {getDiscoverHelperMessage(mood, activity)}
          </p>
        </div>
      </div>

      <DiscoverEmptyState
        mood={mood}
        activity={activity}
        favoriteArtists={favoriteArtists}
      />
    </div>
  );
}
