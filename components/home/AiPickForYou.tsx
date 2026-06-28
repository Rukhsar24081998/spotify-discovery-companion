"use client";

import { Sparkles } from "lucide-react";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import {
  homeSelectableCardClass,
  homeSelectedCardClass,
  openSpotifyUrl,
  useNowSelected,
} from "@/components/layout/BottomPlayer";
import {
  ARTWORK_PLACEHOLDER_SRC,
  DISCOVERY_INSIGHTS,
  resolveMusicSpotifyLink,
} from "@/lib/mockBrowseContent";

const AI_PICK_ID = "ai-pick-featured";

function getArtworkUrl(): string {
  return (
    DISCOVERY_INSIGHTS.mix?.imageUrl ??
    DISCOVERY_INSIGHTS.fallbackTrack?.imageUrl ??
    ARTWORK_PLACEHOLDER_SRC
  );
}

function getSpotifyUrl(): string {
  const mix = DISCOVERY_INSIGHTS.mix;
  const fallback = DISCOVERY_INSIGHTS.fallbackTrack;
  if (mix) {
    return resolveMusicSpotifyLink(mix.spotifyUrl, mix.title);
  }
  if (fallback) {
    return resolveMusicSpotifyLink(fallback.spotifyUrl, fallback.title);
  }
  return resolveMusicSpotifyLink(null, "AI Picks");
}

function getTitle(): string {
  return (
    DISCOVERY_INSIGHTS.mix?.title ??
    DISCOVERY_INSIGHTS.fallbackTrack?.title ??
    "Recommendation"
  );
}

/**
 * Single premium AI recommendation shelf — integrated homepage section.
 */
export function AiPickForYou() {
  const { selectItem, selected } = useNowSelected();
  const isSelected = selected?.id === AI_PICK_ID;
  const { mix, matchScore, cardExplanation } = DISCOVERY_INSIGHTS;
  if (!mix) {
    return null;
  }

  const artworkUrl = getArtworkUrl();
  const spotifyUrl = getSpotifyUrl();
  const title = getTitle();
  const artist = mix.subtitle?.split(" · ")[0];

  const handleSelect = () => {
    selectItem({
      id: AI_PICK_ID,
      title,
      artist,
      type: "Album",
      imageUrl: artworkUrl,
      spotifyUrl,
    });
    openSpotifyUrl(spotifyUrl);
  };

  return (
    <section aria-labelledby="ai-pick-heading" className="mb-3">
      <div className="mb-2">
        <h2
          id="ai-pick-heading"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white"
        >
          <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
          AI Pick For You
        </h2>
        <p className="mt-1 text-sm text-white/55">Based on your recent listening habits</p>
      </div>

      <article
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        onClick={handleSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleSelect();
          }
        }}
        className={`group relative flex flex-col overflow-hidden rounded-lg bg-[#181818] shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:flex-row sm:items-stretch hover:bg-[#282828] ${homeSelectableCardClass} ${isSelected ? homeSelectedCardClass : ""}`}
      >
        <div className="relative z-10 aspect-square w-full shrink-0 overflow-hidden sm:w-[220px] md:w-[260px] lg:w-[280px]">
          <ArtworkImage
            src={artworkUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center gap-3 p-5 sm:p-6">
          <div>
            <p className="text-xl font-bold text-white md:text-2xl">{title}</p>
            {mix.subtitle && (
              <p className="mt-1 text-sm text-white/55">{mix.subtitle}</p>
            )}
            <p className="mt-1.5 inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
              {matchScore}% Match
            </p>
          </div>

          <p className="max-w-xl text-[15px] leading-relaxed text-white/65">{cardExplanation}</p>
        </div>
      </article>
    </section>
  );
}
