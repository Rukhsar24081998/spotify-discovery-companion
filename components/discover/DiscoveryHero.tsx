"use client";

import { Sparkles } from "lucide-react";

interface DiscoveryHeroProps {
  onGetStarted?: () => void;
}

/**
 * Premium hero for the AI Discovery page — title, pitch, and primary entry CTA.
 */
export function DiscoveryHero({ onGetStarted }: DiscoveryHeroProps) {
  return (
    <section
      aria-labelledby="discovery-hero-heading"
      className="relative overflow-hidden rounded-xl p-4 md:p-6 xl:p-8"
      style={{
        background:
          "radial-gradient(ellipse 90% 120% at 15% 50%, #1a5c38 0%, #0f3d24 35%, #0a1f14 60%, #121212 100%)",
      }}
    >
      <div className="pointer-events-none absolute -right-12 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative flex max-w-2xl flex-col gap-3">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          AI Discovery Companion
        </p>

        <h1
          id="discovery-hero-heading"
          className="text-xl font-bold leading-[1.12] tracking-[-0.03em] text-white md:text-[1.75rem] xl:text-[2.1rem]"
        >
          Let&apos;s find something you&apos;ll love.
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-white/60 md:text-[15px] xl:text-base">
          Tell us how you&apos;re feeling and what you&apos;re up to. Our AI will search Spotify
          and surface tracks with clear explanations — not just another shuffle.
        </p>

        <div className="mt-1">
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-accent px-7 py-2.5 text-sm font-bold text-black shadow-[0_4px_20px_rgba(29,185,84,0.35)] transition-all duration-200 ease-out motion-reduce:transition-none hover:bg-accent-hover hover:shadow-[0_6px_24px_rgba(29,185,84,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f14] active:scale-[0.98]"
          >
            Get started
          </button>
        </div>
      </div>
    </section>
  );
}
