interface PreferenceFeedbackToastProps {
  message: string | null;
}

/**
 * Lightweight preference-learning feedback shown after save/skip actions.
 */
export function PreferenceFeedbackToast({ message }: PreferenceFeedbackToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-lg border border-white/10 bg-[#1f1f1f] px-3.5 py-2.5 text-sm text-white/70 animate-fade-in"
    >
      {message}
    </div>
  );
}
