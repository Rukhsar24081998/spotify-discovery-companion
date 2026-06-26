import {
  Heart,
  ListMusic,
  Mic2,
  MonitorSpeaker,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

/**
 * Visual-only Spotify-style playback bar (no audio logic on the home page).
 */
export function BottomPlayer() {
  return (
    <footer
      aria-label="Playback bar"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[90px] items-center justify-between border-t border-[#282828] bg-[#181818] px-4"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 pl-2">
        <div
          className="h-[56px] w-[56px] shrink-0 rounded bg-gradient-to-br from-emerald-600 to-emerald-950 shadow-md"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-normal text-white hover:underline">
            Moonlight Memories
          </p>
          <p className="truncate text-xs text-white/55">The AI Collective</p>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label="Save track"
          className="ml-1 text-accent"
        >
          <Heart className="h-4 w-4 fill-accent" aria-hidden="true" />
        </button>
      </div>

      <div className="hidden max-w-[722px] flex-1 flex-col items-center gap-2 md:flex">
        <div className="flex items-center gap-6">
          <button type="button" disabled aria-disabled="true" aria-label="Shuffle">
            <Shuffle className="h-4 w-4 text-accent" aria-hidden="true" />
          </button>
          <button type="button" disabled aria-disabled="true" aria-label="Previous">
            <SkipBack className="h-5 w-5 text-white/70 hover:text-white" aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            aria-label="Play"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:scale-105"
          >
            <Play className="ml-0.5 h-[18px] w-[18px] fill-black" aria-hidden="true" />
          </button>
          <button type="button" disabled aria-disabled="true" aria-label="Next">
            <SkipForward className="h-5 w-5 text-white/70 hover:text-white" aria-hidden="true" />
          </button>
          <button type="button" disabled aria-disabled="true" aria-label="Repeat">
            <Repeat className="h-4 w-4 text-white/55" aria-hidden="true" />
          </button>
        </div>
        <div className="flex w-full max-w-[580px] items-center gap-2">
          <span className="w-10 text-right text-[11px] tabular-nums text-white/55">1:24</span>
          <div
            role="progressbar"
            aria-valuenow={84}
            aria-valuemin={0}
            aria-valuemax={225}
            aria-label="Playback progress"
            className="group h-1 flex-1 cursor-pointer rounded-full bg-white/25"
          >
            <div className="relative h-full w-[38%] rounded-full bg-white group-hover:bg-accent">
              <span className="absolute -right-1.5 -top-1 hidden h-3 w-3 rounded-full bg-white group-hover:block" />
            </div>
          </div>
          <span className="w-10 text-[11px] tabular-nums text-white/55">3:45</span>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-end gap-3 pr-2 lg:flex">
        <button type="button" disabled aria-disabled="true" aria-label="Lyrics">
          <Mic2 className="h-4 w-4 text-white/55 hover:text-white" aria-hidden="true" />
        </button>
        <button type="button" disabled aria-disabled="true" aria-label="Queue">
          <ListMusic className="h-4 w-4 text-white/55 hover:text-white" aria-hidden="true" />
        </button>
        <button type="button" disabled aria-disabled="true" aria-label="Connect to device">
          <MonitorSpeaker className="h-4 w-4 text-white/55 hover:text-white" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-white/55" aria-hidden="true" />
          <div className="h-1 w-[93px] overflow-hidden rounded-full bg-white/25">
            <div className="h-full w-3/4 rounded-full bg-white/80" />
          </div>
        </div>
      </div>
    </footer>
  );
}
