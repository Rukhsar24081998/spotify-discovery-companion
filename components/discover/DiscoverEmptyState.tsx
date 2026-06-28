import type { ReactNode } from "react";
import type { Activity, Mood } from "@/types";
import {
  ACTIVITY_CHIP_LABELS,
  MOOD_CHIP_LABELS,
} from "@/components/discover/discoveryInputOptions";
import {
  getPreviewGenres,
  hasPreviewGenres,
} from "@/components/discover/discoveryPreviewGenres";
import { buildResearchBackedStrategy } from "@/lib/researchBackedStrategy";

interface DiscoverEmptyStateProps {
  mood: Mood | null;
  activity: Activity | null;
  favoriteArtists: string[];
}

const RESEARCH_PRINCIPLE_ICON = "✓";

function PreviewChip({
  label,
  muted = false,
  accent = false,
}: {
  label: string;
  muted?: boolean;
  accent?: boolean;
}) {
  if (accent) {
    return (
      <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        muted
          ? "border-white/[0.06] bg-[#1a1a1a]/60 text-white/35"
          : "border-white/10 bg-[#282828] text-white/85"
      }`}
    >
      {label}
    </span>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
      {children}
    </p>
  );
}

function PreviewField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt>
        <SectionLabel>{label}</SectionLabel>
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

/**
 * Live discovery preview shown on the input screen before recommendations exist.
 */
export function DiscoverEmptyState({
  mood,
  activity,
  favoriteArtists,
}: DiscoverEmptyStateProps) {
  const hasArtist = favoriteArtists.length > 0;
  const genresReady = hasPreviewGenres(mood, activity);
  const genres = getPreviewGenres(mood, activity);
  const strategy = buildResearchBackedStrategy(mood, activity, favoriteArtists);

  return (
    <section
      aria-label="Discovery preview"
      className="relative overflow-hidden rounded-xl border border-dashed border-white/10 bg-gradient-to-br from-[#181818] via-[#151515] to-[#101010] px-4 py-5 md:px-5 md:py-6 xl:px-8 xl:py-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(29,185,84,0.08),transparent_55%)]" />

      <div className="relative flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-5 md:gap-6 xl:grid-cols-2 xl:gap-8 xl:gap-y-10">
          {/* Left — selection summary */}
          <div>
            <h2 className="mb-3 text-sm font-bold text-white sm:text-base">
              ✨ Discovery Preview
            </h2>

            <dl className="space-y-2.5">
              <PreviewField label="Mood">
                {mood ? (
                  <PreviewChip label={MOOD_CHIP_LABELS[mood]} />
                ) : (
                  <PreviewChip label="Not selected yet" muted />
                )}
              </PreviewField>

              <PreviewField label="Activity">
                {activity ? (
                  <PreviewChip label={ACTIVITY_CHIP_LABELS[activity]} />
                ) : (
                  <PreviewChip label="Not selected yet" muted />
                )}
              </PreviewField>

              <PreviewField label="Inspired by">
                {hasArtist ? (
                  <PreviewChip label={`🎵 ${favoriteArtists.join(", ")}`} />
                ) : (
                  <PreviewChip label="No artist selected" muted />
                )}
              </PreviewField>
            </dl>
          </div>

          {/* Right — inferred style & AI scope */}
          <div className="flex flex-col gap-3 xl:border-l xl:border-white/[0.06] xl:pl-10">
            <div>
              <SectionLabel>🎧 Expected Music Style</SectionLabel>
              <ul
                className="flex flex-wrap gap-1.5"
                aria-label={
                  genresReady
                    ? "Expected music genres"
                    : "Expected music genres preview"
                }
              >
                {genres.map((genre) => (
                  <li key={genre}>
                    <PreviewChip label={genre} muted={!genresReady} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionLabel>🧠 Research-Backed AI Strategy</SectionLabel>
              <p className="mb-2 text-sm leading-relaxed text-white/60">
                {strategy.intro}
              </p>
              <ul
                className="mb-3 space-y-0.5 text-sm text-white/60"
                aria-label="Research-backed optimization principles"
              >
                {strategy.principles.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-accent/80" aria-hidden="true">
                      {RESEARCH_PRINCIPLE_ICON}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p
                className="text-sm leading-relaxed text-white/70"
                aria-live="polite"
              >
                {strategy.personalizedParagraph}
              </p>
            </div>

            <div>
              <SectionLabel>AI Confidence</SectionLabel>
              <PreviewChip label="🟢 High" accent />
            </div>

            <div>
              <SectionLabel>Estimated Results</SectionLabel>
              <PreviewChip label="8–12 Recommendations" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
