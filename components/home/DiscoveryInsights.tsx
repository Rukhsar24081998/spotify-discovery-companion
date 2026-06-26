"use client";

import { useState } from "react";
import { Play, Sparkles, X } from "lucide-react";

/**
 * Floating Discovery Insights panel (visual / illustrative content only).
 */
export function DiscoveryInsights() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return null;
  }

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
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/45 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="rounded-lg bg-[#282828] p-3">
        <div
          className="mb-3 h-[72px] rounded-md bg-gradient-to-r from-emerald-900/50 to-emerald-700/25"
          aria-hidden="true"
        />
        <p className="text-xs italic leading-relaxed text-white/60">
          I noticed you&apos;re exploring deep-house today. Based on your Arctic Monkeys phase, you
          might enjoy this experimental blend...
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-[#282828] p-2.5">
        <div
          className="h-11 w-11 shrink-0 rounded bg-gradient-to-br from-violet-600 to-indigo-900"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-xs font-semibold text-white">Rhythmic Flow Mix</p>
            <span className="shrink-0 rounded bg-accent/20 px-1 py-px text-[9px] font-bold uppercase text-accent">
              AI
            </span>
          </div>
          <p className="truncate text-[11px] text-white/45">Recommended for your current mood</p>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label="Play Rhythmic Flow Mix"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black"
        >
          <Play className="h-3.5 w-3.5 fill-black" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
