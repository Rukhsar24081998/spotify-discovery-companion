"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

interface LoadingStateProps {
  /** Called once after every reasoning step has completed. */
  onComplete?: () => void;
  /** When set, the reasoning steps are replaced by a friendly error state. */
  error?: string | null;
  /** Retry handler used alongside `error` (wired in later phases). */
  onRetry?: () => void;
  /** Per-step dwell time; primarily for testing. */
  stepDurationMs?: number;
}

const STEPS = [
  "Understanding your mood",
  "Understanding your activity",
  "Building a discovery strategy",
  "Searching Spotify",
  "Ranking recommendations",
  "Preparing your discovery",
] as const;

const DEFAULT_STEP_DURATION_MS = 800;

/**
 * Screen 3 — the AI reasoning screen. Communicates progress as a checking-off
 * step list rather than a spinner (ui-guidelines.md -> AI Processing Screen).
 */
export function LoadingState({
  onComplete,
  error = null,
  onRetry,
  stepDurationMs = DEFAULT_STEP_DURATION_MS,
}: LoadingStateProps) {
  const [completed, setCompleted] = useState(0);
  const isDone = completed >= STEPS.length;

  useEffect(() => {
    if (error || isDone) {
      return;
    }
    const timer = setTimeout(() => setCompleted((count) => count + 1), stepDurationMs);
    return () => clearTimeout(timer);
  }, [completed, error, isDone, stepDurationMs]);

  useEffect(() => {
    if (!error && isDone) {
      onComplete?.();
    }
  }, [error, isDone, onComplete]);

  if (error) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Heading level={2}>Something went wrong while discovering music.</Heading>
        <p className="text-body text-white/60">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-support font-semibold text-black transition-colors duration-150 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  const currentStep = isDone ? STEPS[STEPS.length - 1] : STEPS[completed];

  return (
    <div className="flex flex-col gap-6">
      <Heading level={2}>AI Discovery Companion</Heading>

      <ol className="flex flex-col gap-3">
        {STEPS.map((step, index) => {
          const done = index < completed;
          const active = index === completed && !isDone;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-6 w-6 shrink-0 items-center justify-center"
              >
                {done ? (
                  <Check className="h-5 w-5 text-accent" />
                ) : active ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full border border-white/25" />
                )}
              </span>
              <span
                className={
                  done || active
                    ? "text-body text-white"
                    : "text-body text-white/40"
                }
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>

      <p aria-live="polite" className="sr-only">
        {isDone ? "Preparing your discovery" : currentStep}
      </p>
    </div>
  );
}
