import { MOODS, type Mood } from "@/types";
import { SelectionGroup } from "@/components/ui/SelectionGroup";

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (value: Mood | null) => void;
}

/** Required, single-select mood picker in canonical order (ui-guidelines.md). */
export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <SelectionGroup
      legend="How are you feeling?"
      options={MOODS}
      value={value}
      onChange={onChange}
    />
  );
}
