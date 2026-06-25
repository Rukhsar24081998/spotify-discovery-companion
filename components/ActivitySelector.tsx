import { ACTIVITIES, type Activity } from "@/types";
import { SelectionGroup } from "@/components/ui/SelectionGroup";

interface ActivitySelectorProps {
  value: Activity | null;
  onChange: (value: Activity | null) => void;
}

/** Required, single-select activity picker in canonical order (ui-guidelines.md). */
export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  return (
    <SelectionGroup
      legend="What are you doing?"
      options={ACTIVITIES}
      value={value}
      onChange={onChange}
    />
  );
}
