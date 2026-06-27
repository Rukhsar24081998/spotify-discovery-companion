import { MOODS, type Mood } from "@/types";
import { SelectionGroup } from "@/components/ui/SelectionGroup";

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (value: Mood | null) => void;
}

/** Required, single-select mood picker in canonical order (ui-guidelines.md). */
export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-support font-medium text-accent">Step 1 of 3 — How are you feeling today?</p>
      <SelectionGroup
        legend="How are you feeling?"
        headingId="mood-section-heading"
        options={MOODS}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
