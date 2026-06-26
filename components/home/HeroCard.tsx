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
      className="relative mb-8 overflow-hidden rounded-xl p-8 sm:p-10 lg:min-h-[280px] lg:p-12"
      style={{
        background:
          "radial-gradient(ellipse 90% 120% at 20% 50%, #1a5c38 0%, #0f3d24 35%, #0a1f14 60%, #050505 100%)",
      }}
    >
      <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative flex max-w-3xl flex-col gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Beta Experience
        </p>
        <h1
          id="hero-heading"
          className="text-[2.75rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3.25rem]"
        >
          AI Discovery Companion
        </h1>
        <p className="max-w-xl text-lg font-medium leading-snug text-accent">
          Spotify knows what you&apos;ve loved before. Let&apos;s discover what you&apos;ll love
          next.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-white/55">
          An optional AI-powered reasoning layer that helps you break out of repetitive listening
          by expressing your current mood and activity, then discovering new music with transparent
          explanations and 30-second previews.
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/discover"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-7 py-2.5 text-sm font-bold text-black shadow-[0_4px_20px_rgba(29,185,84,0.35)] transition-colors duration-150 motion-reduce:transition-none hover:bg-accent-hover hover:shadow-[0_4px_24px_rgba(29,185,84,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f14]"
          >
            Discover with AI
          </Link>
          <a
            href="#good-evening"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/25 bg-transparent px-7 py-2.5 text-sm font-medium text-white transition-colors duration-150 motion-reduce:transition-none hover:border-white/40 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f14]"
          >
            Continue browsing Spotify
          </a>
        </div>
      </div>
    </section>
  );
}
