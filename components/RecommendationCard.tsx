"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Heart, Music2, SkipForward, Star } from "lucide-react";
import {
  nowSelectedFromRecommendation,
  openSpotifyUrl,
  useNowSelected,
} from "@/components/layout/BottomPlayer";
import type { Activity, Mood, Recommendation } from "@/types";
import { CardShell } from "@/components/ui/CardShell";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import { PreviewPlayer } from "@/components/PreviewPlayer";

export interface RecommendationCardProps {
  recommendation: Recommendation;
  isSaved: boolean;
  isExiting?: boolean;
  isPreviewActive: boolean;
  onPreviewActivate: (trackId: string) => void;
  onPreviewDeactivate: (trackId: string) => void;
  onSave: () => void;
  onSkip: () => void;
  /** Discovery context mood tag, when available. */
  contextMood?: Mood;
  /** Discovery context activity tag, when available. */
  contextActivity?: Activity;
}

function explanationNeedsExpand(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length > 140) {
    return true;
  }
  const sentenceEndings = trimmed.match(/[.!?](?:\s|$)/g);
  return (sentenceEndings?.length ?? 0) > 2;
}

/**
 * Screen 4 — a single recommendation card. Presentational only; all session
 * logic lives in the parent flow container.
 */
export function RecommendationCard({
  recommendation,
  isSaved,
  isExiting = false,
  isPreviewActive,
  onPreviewActivate,
  onPreviewDeactivate,
  onSave,
  onSkip,
  contextMood,
  contextActivity,
}: RecommendationCardProps) {
  const { selectItem } = useNowSelected();
  const [artworkLoaded, setArtworkLoaded] = useState(false);
  const [explanationExpanded, setExplanationExpanded] = useState(false);
  const hasArtwork = recommendation.albumArt.trim().length > 0;
  const showReadMore = explanationNeedsExpand(recommendation.explanation);

  const handleTrackSelect = () => {
    selectItem(nowSelectedFromRecommendation(recommendation));
    openSpotifyUrl(recommendation.spotifyUrl);
  };

  const exitClasses = isExiting
    ? "pointer-events-none opacity-0 -translate-x-3 scale-[0.98] motion-reduce:transform-none motion-reduce:opacity-100"
    : "opacity-100 translate-x-0 scale-100";

  return (
    <CardShell
      interactive
      className={`w-full p-3.5 transition-all duration-300 ease-out motion-reduce:transition-none xl:p-4 ${exitClasses}`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
        <button
          type="button"
          onClick={handleTrackSelect}
          aria-label={`Open ${recommendation.title} on Spotify`}
          className="relative mx-auto aspect-square w-full max-w-[240px] shrink-0 cursor-pointer overflow-hidden rounded-md bg-surface-hover transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface md:mx-0 md:h-24 md:w-24 md:max-w-none xl:h-28 xl:w-28"
        >
          {!artworkLoaded && (
            <div
              aria-hidden="true"
              className="absolute inset-0 animate-pulse bg-surface-hover motion-reduce:animate-none"
            />
          )}
          {hasArtwork ? (
            <ArtworkImage
              src={recommendation.albumArt}
              alt=""
              onLoad={() => setArtworkLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-300 motion-reduce:transition-none ${
                artworkLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-surface-hover text-white/30"
              aria-hidden="true"
            >
              <Music2 className="h-8 w-8" />
            </div>
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="min-w-0 space-y-0.5">
            <button
              type="button"
              onClick={handleTrackSelect}
              className="block w-full min-w-0 truncate text-left text-base font-bold leading-tight text-white transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface xl:text-lg"
            >
              {recommendation.title}
            </button>
            <p className="truncate text-sm text-white/60">{recommendation.artist}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent">
              <Star className="h-3 w-3 shrink-0" aria-hidden="true" />
              {recommendation.discoveryScore}% Match
            </span>
            {contextMood && (
              <span className="rounded-full border border-white/10 bg-[#282828] px-2 py-0.5 text-[11px] font-medium text-white/70">
                {contextMood}
              </span>
            )}
            {contextActivity && (
              <span className="rounded-full border border-white/10 bg-[#282828] px-2 py-0.5 text-[11px] font-medium text-white/70">
                {contextActivity}
              </span>
            )}
          </div>

          <div className="mt-2 space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
              Why AI picked this
            </p>
            <p
              id={`explanation-${recommendation.trackId}`}
              className={`text-[13px] leading-snug text-white/70 ${
                !explanationExpanded && showReadMore ? "line-clamp-3" : ""
              }`}
            >
              {recommendation.explanation}
            </p>
            {showReadMore && (
              <button
                type="button"
                onClick={() => setExplanationExpanded((open) => !open)}
                aria-expanded={explanationExpanded}
                aria-controls={`explanation-${recommendation.trackId}`}
                className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-accent transition-colors duration-150 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {explanationExpanded ? (
                  <>
                    Read less
                    <ChevronUp className="h-3 w-3" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Read more
                    <ChevronDown className="h-3 w-3" aria-hidden="true" />
                  </>
                )}
              </button>
            )}
          </div>

          <PreviewPlayer
            previewUrl={recommendation.previewUrl}
            trackId={recommendation.trackId}
            trackTitle={recommendation.title}
            isActive={isPreviewActive}
            onActivate={onPreviewActivate}
            onDeactivate={onPreviewDeactivate}
          />

          <div className="flex flex-col gap-2 pt-0.5 md:flex-row md:flex-wrap md:items-center">
            <a
              href={recommendation.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => selectItem(nowSelectedFromRecommendation(recommendation))}
              className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition-colors duration-150 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background md:w-auto xl:min-w-[188px]"
            >
              <Music2 className="h-4 w-4" aria-hidden="true" />
              Continue in Spotify
            </a>

            <div className="flex w-full flex-wrap items-center gap-1.5 md:w-auto">
              <button
                type="button"
                onClick={onSave}
                aria-pressed={isSaved}
                className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-support font-medium text-white transition-colors duration-150 motion-reduce:transition-none hover:border-white/40 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background md:flex-none"
              >
                <Heart
                  className={`h-3.5 w-3.5 ${isSaved ? "fill-accent text-accent" : ""}`}
                  aria-hidden="true"
                />
                {isSaved ? "❤️ Saved" : "Save"}
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-support text-white/70 transition-colors duration-150 motion-reduce:transition-none hover:bg-surface-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background md:flex-none"
              >
                <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
