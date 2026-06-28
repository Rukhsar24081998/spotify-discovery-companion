"use client";

import { useEffect, useRef, useState } from "react";
import type { Activity, Mood } from "@/types";
import {
  DISCOVERY_PIPELINE_STAGES,
  PIPELINE_MAX_STAGE_WHILE_PENDING,
} from "@/lib/discoveryPipeline";
import { AiAnalyzerPanel } from "@/components/discover/AiAnalyzerPanel";
import { DiscoverFormPreview } from "@/components/discover/DiscoverFormPreview";
import { DiscoverProcessingFooter } from "@/components/discover/DiscoverProcessingFooter";
import { ProcessingPipeline } from "@/components/discover/ProcessingPipeline";
import { Heading } from "@/components/ui/Heading";

interface LoadingStateProps {
  /** Called once every pipeline stage has completed visually. */
  onComplete?: () => void;
  /** When set, the processing UI is replaced by a friendly error state. */
  error?: string | null;
  /** Retry handler used alongside `error`. */
  onRetry?: () => void;
  /** True once /api/discover returns — drives final pipeline stages. */
  fetchComplete?: boolean;
  mood?: Mood | null;
  activity?: Activity | null;
  favoriteArtists?: string[];
  /** Interval for early-stage visualization while the API is in flight. */
  pendingStageIntervalMs?: number;
  /** Interval for completing final stages once the API returns. */
  finalizeStageIntervalMs?: number;
}

const SERVICE_ERROR_HEADING = "Something went wrong while discovering music.";
const SERVICE_ERROR_BODY = "Please try again in a moment.";

/**
 * Screen 3 — AI processing experience (design-reference/03-ai-processing.png).
 * Visualizes the real /api/discover pipeline; transition timing is controlled
 * by DiscoveryFlow (fetchComplete + existing min-loading guard).
 */
export function LoadingState({
  onComplete,
  error = null,
  onRetry,
  fetchComplete = false,
  mood = null,
  activity = null,
  favoriteArtists = [],
  pendingStageIntervalMs = 480,
  finalizeStageIntervalMs = 90,
}: LoadingStateProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const finalizeStartedRef = useRef(false);

  const stages = DISCOVERY_PIPELINE_STAGES;
  const allComplete = completedCount >= stages.length;

  useEffect(() => {
    if (error || fetchComplete) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((current) => {
        if (current >= PIPELINE_MAX_STAGE_WHILE_PENDING) {
          return current;
        }
        const next = current + 1;
        setCompletedCount(next);
        return next;
      });
    }, pendingStageIntervalMs);

    return () => clearInterval(timer);
  }, [error, fetchComplete, pendingStageIntervalMs]);

  useEffect(() => {
    if (error || !fetchComplete || finalizeStartedRef.current) {
      return;
    }
    finalizeStartedRef.current = true;

    const timer = setInterval(() => {
      setCompletedCount((count) => {
        if (count >= stages.length) {
          clearInterval(timer);
          return count;
        }
        const next = count + 1;
        setActiveIndex(Math.min(next, stages.length - 1));
        return next;
      });
    }, finalizeStageIntervalMs);

    return () => clearInterval(timer);
  }, [error, fetchComplete, finalizeStageIntervalMs, stages.length]);

  useEffect(() => {
    if (!error && allComplete) {
      onComplete?.();
    }
  }, [error, allComplete, onComplete]);

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-start gap-4 animate-fade-in">
        <Heading level={2}>{SERVICE_ERROR_HEADING}</Heading>
        <p className="text-body text-white/70">{SERVICE_ERROR_BODY}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-6 py-3 text-support font-semibold text-black transition-colors duration-150 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  const currentStage = stages[Math.min(activeIndex, stages.length - 1)] ?? stages[0];

  return (
    <div className="relative mb-8 animate-fade-in">
      <div className="lg:pr-[340px]">
        <DiscoverFormPreview
          mood={mood}
          activity={activity}
          favoriteArtists={favoriteArtists}
        />
        <ProcessingPipeline
          stages={stages}
          activeIndex={activeIndex}
          completedCount={completedCount}
        />
      </div>

      <AiAnalyzerPanel
        stages={stages}
        activeIndex={activeIndex}
        completedCount={completedCount}
        message={currentStage.message}
      />

      <DiscoverProcessingFooter />

      <p className="sr-only" aria-live="polite">
        {currentStage.label}: {currentStage.message}
      </p>
    </div>
  );
}
