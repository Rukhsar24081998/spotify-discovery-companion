"use client";

import { useState } from "react";
import { Play, Sparkles, X } from "lucide-react";
import { DISCOVERY_INSIGHTS, spotifyLinkProps } from "@/lib/mockBrowseContent";

const linkClass =
  "rounded-sm transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/**
 * Floating Discovery Insights panel (visual / illustrative content only).
 */
export function DiscoveryInsights() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return null;
  }

  const { mix, headerImageUrl } = DISCOVERY_INSIGHTS;

  return (
    <aside
      aria-label="Discovery Insights"
      className="fixed bottom-[100px] right-8 z-30 hidden w-[300px] flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#181818]/95 p-4 shadow-[0_0_40px_rgba(29,185,84,0.15),0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md xl:flex"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
          <h2 className="text-sm font-bold text-white">Discovery Insights</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Dismiss Discovery Insights"
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/45 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="rounded-lg bg-[#282828] p-3">
        <a
          {...spotifyLinkProps(mix.spotifyUrl, `Open ${mix.title} on Spotify`)}
          className={`mb-3 block overflow-hidden rounded-md ${linkClass}`}
        >
          <img
            src={headerImageUrl}
            alt=""
            loading="lazy"
            className="h-[72px] w-full object-cover"
          />
        </a>
        <p className="text-xs italic leading-relaxed text-white/60">
          I noticed you&apos;re exploring deep-house today. Based on your Arctic Monkeys phase, you
          might enjoy this experimental blend...
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-[#282828] p-2.5">
        <a
          {...spotifyLinkProps(mix.spotifyUrl, `Open artwork for ${mix.title} on Spotify`)}
          className={`shrink-0 ${linkClass}`}
        >
          <img
            src={mix.imageUrl}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            className="h-11 w-11 rounded object-cover"
          />
        </a>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <a
              {...spotifyLinkProps(mix.spotifyUrl, `Open ${mix.title} on Spotify`)}
              className={`truncate text-xs font-semibold text-white hover:underline ${linkClass}`}
            >
              {mix.title}
            </a>
            <span className="shrink-0 rounded bg-accent/20 px-1 py-px text-[9px] font-bold uppercase text-accent">
              AI
            </span>
          </div>
          <p className="truncate text-[11px] text-white/45">{mix.subtitle}</p>
        </div>
        <a
          {...spotifyLinkProps(mix.spotifyUrl, `Play ${mix.title} on Spotify`)}
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-150 hover:scale-105 ${linkClass}`}
        >
          <Play className="h-3.5 w-3.5 fill-black" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
