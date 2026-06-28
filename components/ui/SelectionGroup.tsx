import { useId, type KeyboardEvent } from "react";
import { PillButton } from "@/components/ui/PillButton";

interface SelectionGroupProps<T extends string> {
  /** Visible prompt, e.g. "How are you feeling?". */
  legend: string;
  /** Supporting copy below the heading. */
  description?: string;
  /** Stable id for the section heading (accessibility). */
  headingId?: string;
  /** Options rendered in the given (canonical) order. */
  options: readonly T[];
  value: T | null;
  /** Optional display formatter for chip labels. */
  formatLabel?: (option: T) => string;
  /** Toggles: selecting a new option switches; re-selecting clears to null. */
  onChange: (value: T | null) => void;
}

/**
 * Generic single-select pill group shared by MoodSelector and ActivitySelector
 * (avoids duplicating identical selection logic). Keyboard accessible.
 */
export function SelectionGroup<T extends string>({
  legend,
  description,
  headingId,
  options,
  value,
  formatLabel,
  onChange,
}: SelectionGroupProps<T>) {
  const generatedHeadingId = useId();
  const resolvedHeadingId = headingId ?? generatedHeadingId;
  const groupId = useId();

  function focusOption(option: T) {
    document.getElementById(`${groupId}-${option}`)?.focus();
  }

  function handleGroupKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const navigationKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!navigationKeys.includes(event.key)) {
      return;
    }

    event.preventDefault();
    const currentIndex = value !== null ? options.indexOf(value) : -1;
    const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const nextIndex =
      currentIndex === -1
        ? delta > 0
          ? 0
          : options.length - 1
        : (currentIndex + delta + options.length) % options.length;
    const nextOption = options[nextIndex];
    onChange(nextOption);
    focusOption(nextOption);
  }

  return (
    <section aria-labelledby={resolvedHeadingId} className="flex flex-col gap-3">
      <div className="space-y-1">
        <h2
          id={resolvedHeadingId}
          tabIndex={-1}
          className="rounded-sm text-lg font-bold tracking-tight text-white outline-none focus-visible:ring-2 focus-visible:ring-accent xl:text-xl"
        >
          {legend}
        </h2>
        {description && (
          <p id={`${resolvedHeadingId}-description`} className="text-sm text-white/50">
            {description}
          </p>
        )}
      </div>
      <div
        role="group"
        aria-labelledby={resolvedHeadingId}
        aria-describedby={description ? `${resolvedHeadingId}-description` : undefined}
        onKeyDown={handleGroupKeyDown}
        className="flex flex-wrap gap-2 md:gap-2.5 xl:gap-3"
      >
        {options.map((option) => (
          <PillButton
            key={option}
            id={`${groupId}-${option}`}
            selected={value === option}
            onClick={() => onChange(value === option ? null : option)}
          >
            {formatLabel ? formatLabel(option) : option}
          </PillButton>
        ))}
      </div>
    </section>
  );
}
