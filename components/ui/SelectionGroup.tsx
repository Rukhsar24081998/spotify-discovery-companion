import { useId } from "react";
import { PillButton } from "@/components/ui/PillButton";

interface SelectionGroupProps<T extends string> {
  /** Visible prompt, e.g. "How are you feeling?". */
  legend: string;
  /** Options rendered in the given (canonical) order. */
  options: readonly T[];
  value: T | null;
  /** Toggles: selecting a new option switches; re-selecting clears to null. */
  onChange: (value: T | null) => void;
}

/**
 * Generic single-select pill group shared by MoodSelector and ActivitySelector
 * (avoids duplicating identical selection logic). Keyboard accessible.
 */
export function SelectionGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: SelectionGroupProps<T>) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-title font-semibold text-white">
        {legend}
      </h2>
      <div role="group" aria-labelledby={headingId} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <PillButton
            key={option}
            selected={value === option}
            onClick={() => onChange(value === option ? null : option)}
          >
            {option}
          </PillButton>
        ))}
      </div>
    </section>
  );
}
