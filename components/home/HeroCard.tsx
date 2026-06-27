import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Large AI Discovery hero card matching design-reference/01-home.png.
 * Primary CTA preserves the existing /discover navigation flow.
 */
export function HeroCard() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mb-4 overflow-hidden rounded-lg p-5 sm:p-6 lg:min-h-[180px] lg:p-6"
      style={{
        background:
          "radial-gradient(ellipse 90% 120% at 20% 50%, #1a5c38 0%, #0f3d24 35%, #0a1f14 60%, #050505 100%)",
      }}
    >
      <div className="pointer-events-none absolute -right-16 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative flex max-w-3xl flex-col gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Beta Experience
        </p>
        <h1
          id="hero-heading"
          className="text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-[2.35rem]"
        >
          AI Discovery Companion
        </h1>
        <p className="max-w-xl text-base font-medium leading-snug text-accent">
          Spotify knows what you&apos;ve loved before. Let&apos;s discover what you&apos;ll love
          next.
        </p>
        <p className="max-w-2xl text-[13px] leading-relaxed text-white/55">
          An optional AI-powered reasoning layer that helps you break out of repetitive listening
          by expressing your current mood and activity, then discovering new music with transparent
          explanations and 30-second previews.
        </p>

        <div className="mt-1.5 flex flex-wrap gap-2.5">
          <Link
            href="/discover"
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-accent px-7 py-2.5 text-sm font-bold text-black shadow-[0_4px_20px_rgba(29,185,84,0.35)] transition-all duration-150 motion-reduce:transition-none hover:bg-accent-hover hover:shadow-[0_4px_24px_rgba(29,185,84,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f14] active:scale-[0.98]"
          >
            Discover with AI
          </Link>
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border border-white/25 bg-transparent px-7 py-2.5 text-sm font-medium text-white transition-all duration-150 motion-reduce:transition-none hover:border-white/40 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f14]"
          >
            Continue browsing Spotify
          </a>
        </div>
      </div>
    </section>
  );
}
