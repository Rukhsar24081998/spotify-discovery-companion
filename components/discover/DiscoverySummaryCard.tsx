import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import type { Activity, Mood } from "@/types";
import {
  buildAiSummaryExplanation,
  formatRecommendationCountPill,
} from "@/components/discover/discoverySummary";

interface DiscoverySummaryCardProps {
  mood: Mood;
  activity: Activity;
  recommendationCount: number;
}

function SummaryPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-[#282828] px-2.5 py-1 text-xs font-semibold text-white">
      {children}
    </span>
  );
}

/**
 * Compact AI context summary shown above recommendation results.
 */
export function DiscoverySummaryCard({
  mood,
  activity,
  recommendationCount,
}: DiscoverySummaryCardProps) {
  const explanation = buildAiSummaryExplanation(mood, activity);

  return (
    <section
      aria-label="AI discovery summary"
      className="rounded-xl border border-white/[0.08] bg-[#181818] p-4 md:p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <h2 className="text-sm font-bold text-white">AI Summary</h2>
      </div>

      <dl className="mb-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        <div className="space-y-1.5">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
            Mood
          </dt>
          <dd>
            <SummaryPill>{mood}</SummaryPill>
          </dd>
        </div>
        <div className="space-y-1.5">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
            Activity
          </dt>
          <dd>
            <SummaryPill>{activity}</SummaryPill>
          </dd>
        </div>
        <div className="space-y-1.5">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
            Results
          </dt>
          <dd>
            <SummaryPill>{formatRecommendationCountPill(recommendationCount)}</SummaryPill>
          </dd>
        </div>
      </dl>

      <div className="mb-3 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
          AI Confidence
        </span>
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent">
          High
        </span>
      </div>

      <p className="text-sm leading-relaxed text-white/65">{explanation}</p>
    </section>
  );
}
