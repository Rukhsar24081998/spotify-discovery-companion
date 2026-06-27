import { Search, Smile, UserSearch, Zap } from "lucide-react";
import { ACTIVITIES, MOODS, type Activity, type Mood } from "@/types";

interface DiscoverFormPreviewProps {
  mood: Mood | null;
  activity: Activity | null;
  favoriteArtists: string[];
}

/**
 * Read-only discover form shown behind the AI analyzer during processing
 * (design-reference/03-ai-processing.png).
 */
export function DiscoverFormPreview({ mood, activity, favoriteArtists }: DiscoverFormPreviewProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none opacity-60"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Discover Music</h1>
        <p className="mt-2 text-sm text-white/50">Tell AI how you&apos;re feeling right now...</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl bg-[#181818] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-accent">
            <Smile className="h-4 w-4" aria-hidden="true" />
            Moods
          </h2>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((option) => {
              const selected = mood === option;
              return (
                <span
                  key={option}
                  className={`inline-flex min-h-[36px] items-center rounded-full px-4 py-1.5 text-xs font-semibold ${
                    selected
                      ? "bg-accent text-black"
                      : "border border-white/10 bg-[#282828] text-white/70"
                  }`}
                >
                  {option}
                </span>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl bg-[#181818] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-accent">
            <Zap className="h-4 w-4" aria-hidden="true" />
            Activities
          </h2>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map((option) => {
              const selected = activity === option;
              return (
                <span
                  key={option}
                  className={`inline-flex min-h-[36px] items-center rounded-full px-4 py-1.5 text-xs font-semibold ${
                    selected
                      ? "bg-accent text-black"
                      : "border border-white/10 bg-[#282828] text-white/70"
                  }`}
                >
                  {option}
                </span>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl bg-[#181818] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-accent">
          <UserSearch className="h-4 w-4" aria-hidden="true" />
          Influences
        </h2>
        <div className="mb-3 flex h-11 items-center rounded-lg bg-[#282828] px-4 text-sm text-white/35">
          <Search className="mr-3 h-4 w-4 shrink-0" aria-hidden="true" />
          Search artists you love...
        </div>
        {favoriteArtists.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {favoriteArtists.map((artist) => (
              <span
                key={artist}
                className="inline-flex items-center gap-2 rounded-full bg-[#282828] py-1 pl-1 pr-3 text-xs font-medium text-white"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-900 text-[10px] font-bold text-white">
                  {artist.charAt(0)}
                </span>
                {artist}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
