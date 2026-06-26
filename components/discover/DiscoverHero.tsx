import { Sparkles } from "lucide-react";

/**
 * Discover page hero matching design-reference/02-discovery.png.
 * Primary CTA scrolls to the form — the user is already on the discover route.
 */
export function DiscoverHero() {
  return (
    <section
      aria-labelledby="discover-hero-heading"
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
          id="discover-hero-heading"
          className="text-[2.75rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3.25rem]"
        >
          AI Discovery Companion
        </h1>
        <p className="max-w-xl text-lg font-medium leading-snug text-accent">
          Spotify knows what you&apos;ve loved before. Let&apos;s discover what you&apos;ll love
          next.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-white/55">
          Break out of repetitive listening using AI recommendations based on your mood, activity,
          and favorite artists. Immerse yourself in a journey tailored just for you.
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href="#discover-form"
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-accent px-7 py-2.5 text-sm font-bold text-black shadow-[0_4px_20px_rgba(29,185,84,0.35)] transition-all duration-150 motion-reduce:transition-none hover:bg-accent-hover hover:shadow-[0_4px_24px_rgba(29,185,84,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f14] active:scale-[0.98]"
          >
            Discover with AI
          </a>
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
