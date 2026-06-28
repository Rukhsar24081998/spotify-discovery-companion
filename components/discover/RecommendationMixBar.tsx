import {
  DIVERSITY_CATEGORIES,
  DIVERSITY_CATEGORY_LABELS,
  type DiversityCategory,
} from "@/lib/recommendationClassifier";
import type { DiversityMixCounts } from "@/lib/diversityEngine";
import { buildMixBalanceCaption } from "@/knowledge/researchInsights";

interface RecommendationMixBarProps {
  counts: DiversityMixCounts;
}

/**
 * Summary strip showing the diversity mix above recommendation results.
 */
export function RecommendationMixBar({ counts }: RecommendationMixBarProps) {
  const visibleCategories = DIVERSITY_CATEGORIES.filter(
    (category) => counts[category] > 0,
  ) as DiversityCategory[];

  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Recommendation mix"
      className="rounded-xl border border-white/[0.08] bg-[#181818] px-4 py-3.5 sm:px-5"
    >
      <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">
        Recommendation Mix
      </h2>
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-white/75">
        {visibleCategories.map((category, index) => {
          const { emoji, label } = DIVERSITY_CATEGORY_LABELS[category];
          return (
            <li key={category} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-white/25" aria-hidden="true">
                  •
                </span>
              )}
              <span>
                {emoji} {label} · {counts[category]}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2.5 text-xs leading-relaxed text-white/45">
        {buildMixBalanceCaption()}
      </p>
    </section>
  );
}
