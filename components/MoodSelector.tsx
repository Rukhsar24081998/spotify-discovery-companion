import { MOODS, type Mood } from "@/types";
import { MOOD_CHIP_LABELS } from "@/components/discover/discoveryInputOptions";
import { SelectionGroup } from "@/components/ui/SelectionGroup";

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (value: Mood | null) => void;
}

/** Required, single-select mood picker in canonical order (ui-guidelines.md). */
export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <section
      aria-labelledby="mood-step-label"
      className="rounded-xl border border-white/[0.06] bg-[#181818]/80 p-4 md:p-5 xl:p-6"
    >
      <p
        id="mood-step-label"
        className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
      >
        Step 1 of 3 — Mood
      </p>
      <SelectionGroup
        legend="How are you feeling?"
        description="Choose the mood that best matches how you're feeling right now."
        headingId="mood-section-heading"
        options={MOODS}
        value={value}
        onChange={onChange}
        formatLabel={(option) => MOOD_CHIP_LABELS[option]}
      />
    </section>
  );
}
