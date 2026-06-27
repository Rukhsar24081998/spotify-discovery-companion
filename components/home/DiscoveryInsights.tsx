"use client";

import { useState } from "react";
import { Check, Play, X } from "lucide-react";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import {
  ARTWORK_PLACEHOLDER_SRC,
  DISCOVERY_INSIGHTS,
  resolveMusicSpotifyLink,
  spotifyLinkProps,
} from "@/lib/mockBrowseContent";

const linkClass =
  "rounded-sm transition-all duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

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
 * Floating AI Companion panel — conversational Spotify-style recommendation UI.
 */
export function DiscoveryInsights() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return null;
  }

  const { recentListening, matchScore, pitch, recommendationReason, reasons } =
    DISCOVERY_INSIGHTS;
  const artworkUrl = getArtworkUrl();
  const spotifyUrl = getSpotifyUrl();
  const title = getTitle();

  return (
    <aside
      aria-label="AI Companion"
      className="fixed bottom-[108px] right-4 z-30 hidden w-[min(340px,calc(100vw-2rem))] max-h-[calc(100vh-160px)] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#181818] shadow-[0_12px_40px_rgba(0,0,0,0.65)] xl:right-6 xl:flex"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="text-lg leading-none" aria-hidden="true">
            🤖
          </span>
          <h2 className="text-[15px] font-bold tracking-tight text-white">AI Companion</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Dismiss AI Companion"
          className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/45 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5">
        {/* Conversational intro */}
        <div className="space-y-3 text-[14px] leading-relaxed text-white/75">
          <p className="text-white/90">Hi! I analyzed your recent listening.</p>

          <div>
            <p className="mb-2 text-white/55">You&apos;ve been enjoying:</p>
            <ul className="space-y-1">
              {recentListening.map((item) => (
                <li key={item} className="flex items-center gap-2 text-white/80">
                  <span className="text-sm" aria-hidden="true">
                    🎵
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p>{pitch}</p>
        </div>

        {/* Recommendation card */}
        <article className="group/card flex flex-col overflow-hidden rounded-xl bg-[#282828] shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
          {/* Artwork — ~50% of card visual weight */}
          <a
            {...spotifyLinkProps(spotifyUrl, `Open ${title} on Spotify`)}
            className={`group/art relative block aspect-square w-full overflow-hidden ${linkClass}`}
          >
            <ArtworkImage
              src={artworkUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-200 group-hover/art:scale-[1.05]"
            />
          </a>

          <div className="space-y-1.5 p-4">
            <h3 className="text-lg font-bold leading-tight text-white">{title}</h3>
            <p className="text-sm font-semibold text-accent">{matchScore}% Match</p>
            <p className="text-[13px] leading-snug text-white/55">{recommendationReason}</p>
          </div>
        </article>

        {/* Why you'll like it */}
        <div className="space-y-2.5">
          <p className="text-[14px] font-semibold text-white/90">
            Why you&apos;ll probably like it
          </p>
          <ul className="space-y-2">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-center gap-2.5 text-[13px] text-white/70">
                <Check className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Open in Spotify */}
        <a
          {...spotifyLinkProps(spotifyUrl, `Open ${title} on Spotify`)}
          className={`inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-black shadow-[0_4px_20px_rgba(29,185,84,0.35)] transition-all duration-200 hover:scale-[1.02] hover:bg-accent-hover hover:shadow-[0_6px_24px_rgba(29,185,84,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] active:scale-[0.98] ${linkClass}`}
        >
          <Play className="h-4 w-4 fill-black" aria-hidden="true" />
          Open in Spotify
        </a>
      </div>
    </aside>
  );
}
