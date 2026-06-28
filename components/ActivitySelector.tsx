import { ACTIVITIES, type Activity } from "@/types";
import { ACTIVITY_CHIP_LABELS } from "@/components/discover/discoveryInputOptions";
import { SelectionGroup } from "@/components/ui/SelectionGroup";

interface ActivitySelectorProps {
  value: Activity | null;
  onChange: (value: Activity | null) => void;
}

/** Required, single-select activity picker in canonical order (ui-guidelines.md). */
export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  return (
    <section
      aria-labelledby="activity-step-label"
      className="rounded-xl border border-white/[0.06] bg-[#181818]/80 p-5 sm:p-6"
    >
      <p
        id="activity-step-label"
        className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
      >
        Step 2 of 3 — Activity
      </p>
      <SelectionGroup
        legend="What are you doing?"
        description="Tell the AI what you're doing so recommendations better fit your current moment."
        headingId="activity-section-heading"
        options={ACTIVITIES}
        value={value}
        onChange={onChange}
        formatLabel={(option) => ACTIVITY_CHIP_LABELS[option]}
      />
    </section>
  );
}
