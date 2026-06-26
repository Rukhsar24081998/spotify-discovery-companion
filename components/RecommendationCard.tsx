"use client";

import { useState } from "react";
import { Heart, Music2, SkipForward, Star } from "lucide-react";
import type { Recommendation } from "@/types";
import { CardShell } from "@/components/ui/CardShell";

export interface RecommendationCardProps {
  recommendation: Recommendation;
  isSaved: boolean;
  isExiting?: boolean;
  onSave: () => void;
  onSkip: () => void;
}

/**
 * Screen 4 — a single recommendation card. Presentational only; all session
 * logic lives in the parent flow container.
 */
export function RecommendationCard({
  recommendation,
  isSaved,
  isExiting = false,
  onSave,
  onSkip,
}: RecommendationCardProps) {
  const [artworkLoaded, setArtworkLoaded] = useState(false);
  const hasArtwork = recommendation.albumArt.trim().length > 0;

  const exitClasses = isExiting
    ? "pointer-events-none opacity-0 -translate-x-3 scale-[0.98] motion-reduce:transform-none motion-reduce:opacity-100"
    : "opacity-100 translate-x-0 scale-100";

  return (
    <CardShell
      className={`flex flex-col gap-4 transition-all duration-300 ease-out motion-reduce:transition-none ${exitClasses}`}
    >
      <div className="relative aspect-square w-full max-w-[240px] overflow-hidden rounded-lg bg-surface-hover">
        {!artworkLoaded && (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-surface-hover motion-reduce:animate-none"
          />
        )}
        {hasArtwork ? (
          <img
            src={recommendation.albumArt}
            alt={`Album artwork for ${recommendation.title} by ${recommendation.artist}`}
            loading="lazy"
            onLoad={() => setArtworkLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-300 motion-reduce:transition-none ${
              artworkLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-surface-hover text-white/30"
            role="img"
            aria-label={`No artwork available for ${recommendation.title}`}
          >
            <Music2 className="h-12 w-12" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="truncate text-title font-semibold text-white">
          {recommendation.title}
        </h3>
        <p className="truncate text-body text-white/70">{recommendation.artist}</p>
      </div>

      <p className="flex items-center gap-1.5 text-body font-medium text-white">
        <Star className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span>{recommendation.discoveryScore}% Discovery Match</span>
      </p>

      <p className="line-clamp-3 text-body text-white/80">{recommendation.explanation}</p>

      {/* Phase 10: PreviewPlayer replaces this placeholder */}
      <div
        aria-hidden="true"
        className="rounded-lg border border-dashed border-white/15 px-4 py-3 text-support text-white/40"
      >
        ▶ Preview (30 sec)
      </div>

      <div className="flex flex-col gap-3 pt-1">
        <a
          href={recommendation.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-body font-semibold text-black transition-colors duration-150 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Music2 className="h-5 w-5" aria-hidden="true" />
          Continue in Spotify
        </a>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            aria-pressed={isSaved}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-support font-medium text-white transition-colors duration-150 motion-reduce:transition-none hover:border-white/40 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Heart
              className={`h-4 w-4 ${isSaved ? "fill-accent text-accent" : ""}`}
              aria-hidden="true"
            />
            {isSaved ? "Saved" : "Save"}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-support text-white/60 transition-colors duration-150 motion-reduce:transition-none hover:bg-surface-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <SkipForward className="h-4 w-4" aria-hidden="true" />
            Skip
          </button>
        </div>
      </div>
    </CardShell>
  );
}
