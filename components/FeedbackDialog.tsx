"use client";

import { useEffect, useId, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { FEEDBACK_REASONS, type FeedbackReason } from "@/types";
import { PillButton } from "@/components/ui/PillButton";

interface FeedbackDialogProps {
  open: boolean;
  selectedReason: FeedbackReason | null;
  onSelectReason: (reason: FeedbackReason) => void;
  onDismiss: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}

const FEEDBACK_ERROR_MESSAGE =
  "Something went wrong while updating recommendations. Please try again in a moment.";

/**
 * Optional feedback dialog after multiple skips. Single-select reason, dismissible.
 */
export function FeedbackDialog({
  open,
  selectedReason,
  onSelectReason,
  onDismiss,
  onSubmit,
  submitting,
  error,
}: FeedbackDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dismissButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    dismissButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        onDismiss();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, submitting, onDismiss]);

  function handleRadioKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
      return;
    }
    event.preventDefault();
    const currentIndex = selectedReason
      ? FEEDBACK_REASONS.indexOf(selectedReason)
      : -1;
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex =
      currentIndex === -1
        ? delta > 0
          ? 0
          : FEEDBACK_REASONS.length - 1
        : (currentIndex + delta + FEEDBACK_REASONS.length) % FEEDBACK_REASONS.length;
    onSelectReason(FEEDBACK_REASONS[nextIndex]);
  }

  if (!open) {
    return null;
  }

  const canSubmit = selectedReason !== null && !submitting;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Dismiss feedback dialog"
        disabled={submitting}
        onClick={onDismiss}
        className="absolute inset-0 bg-black/70 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 shadow-xl animate-fade-in"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h2 id={titleId} className="text-heading font-semibold text-white">
              Help us improve
            </h2>
            <p id={descriptionId} className="text-body text-white/70">
              Why wasn&apos;t this a good fit?
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Feedback reason"
            onKeyDown={handleRadioKeyDown}
            className="flex flex-col gap-2"
          >
            {FEEDBACK_REASONS.map((reason) => {
              const selected = selectedReason === reason;
              return (
                <PillButton
                  key={reason}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  selected={selected}
                  disabled={submitting}
                  onClick={() => onSelectReason(reason)}
                  className="w-full justify-start px-4 py-3 text-left"
                >
                  {reason}
                </PillButton>
              );
            })}
          </div>

          {error && (
            <p role="alert" className="text-support text-white/70">
              {FEEDBACK_ERROR_MESSAGE}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              ref={dismissButtonRef}
              type="button"
              disabled={submitting}
              onClick={onDismiss}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-support font-medium text-white/70 transition-colors duration-150 motion-reduce:transition-none hover:border-white/40 hover:bg-surface-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Not now
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={onSubmit}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-5 py-2.5 text-support font-semibold text-black transition-colors duration-150 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-white/50"
            >
              {submitting ? "Updating…" : "Update Recommendations"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
