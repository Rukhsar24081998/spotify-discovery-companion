import { Sparkles } from "lucide-react";

/**
 * Footer strip from design-reference/03-ai-processing.png.
 */
export function DiscoverProcessingFooter() {
  return (
    <footer className="relative z-10 mt-10 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-[11px] text-white/35">
        <p className="font-semibold text-white/45">AI Discovery</p>
        <p>© 2024 Spotify AI Discovery</p>
      </div>

      <nav
        aria-label="Legal links"
        className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/35"
      >
        {["Legal", "Privacy Center", "Privacy Policy", "Cookies", "About Ads"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </nav>

      <button
        type="button"
        disabled
        aria-disabled="true"
        aria-busy="true"
        className="inline-flex min-h-[48px] cursor-wait items-center justify-center gap-2 self-end rounded-full bg-accent px-8 py-3 text-sm font-bold text-black shadow-[0_0_28px_rgba(29,185,84,0.45)] sm:self-auto"
      >
        <Sparkles className="h-4 w-4 motion-reduce:animate-none animate-pulse" aria-hidden="true" />
        Discover Music
      </button>
    </footer>
  );
}
