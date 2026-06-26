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
import { COMING_SOON_TITLE, NOW_PLAYING, spotifyLinkProps } from "@/lib/mockBrowseContent";

const disabledControlClass =
  "cursor-not-allowed text-white/30 transition-colors duration-150";

const linkClass =
  "rounded-sm transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/**
 * Visual-only Spotify-style playback bar (no audio logic on browse pages).
 */
export function BottomPlayer() {
  return (
    <footer
      aria-label="Playback bar"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[90px] items-center justify-between border-t border-[#282828] bg-[#181818] px-4"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 pl-2">
        <a
          {...spotifyLinkProps(NOW_PLAYING.trackSpotifyUrl, `Open ${NOW_PLAYING.title} on Spotify`)}
          className={`shrink-0 ${linkClass}`}
        >
          <img
            src={NOW_PLAYING.imageUrl}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            className="h-[56px] w-[56px] rounded object-cover shadow-md"
          />
        </a>
        <div className="min-w-0">
          <a
            {...spotifyLinkProps(NOW_PLAYING.trackSpotifyUrl, `Open ${NOW_PLAYING.title} on Spotify`)}
            className={`block truncate text-sm font-normal text-white hover:underline ${linkClass}`}
          >
            {NOW_PLAYING.title}
          </a>
          <a
            {...spotifyLinkProps(
              NOW_PLAYING.artistSpotifyUrl,
              `Open ${NOW_PLAYING.artist} on Spotify`,
            )}
            className={`block truncate text-xs text-white/55 hover:text-white hover:underline ${linkClass}`}
          >
            {NOW_PLAYING.artist}
          </a>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={COMING_SOON_TITLE}
          aria-label="Save track"
          className={`ml-1 shrink-0 ${disabledControlClass}`}
        >
          <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
        </button>
      </div>

      <div className="hidden max-w-[722px] flex-1 flex-col items-center gap-2 md:flex">
        <div className="flex items-center gap-6">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TITLE}
            aria-label="Shuffle"
            className={disabledControlClass}
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TITLE}
            aria-label="Previous"
            className={disabledControlClass}
          >
            <SkipBack className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TITLE}
            aria-label="Play"
            className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full bg-white/40 text-black/50"
          >
            <Play className="ml-0.5 h-[18px] w-[18px] fill-current" aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TITLE}
            aria-label="Next"
            className={disabledControlClass}
          >
            <SkipForward className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TITLE}
            aria-label="Repeat"
            className={disabledControlClass}
          >
            <Repeat className="h-4 w-4" aria-hidden="true" />
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
            title={COMING_SOON_TITLE}
            className="group h-1 flex-1 cursor-not-allowed rounded-full bg-white/25"
          >
            <div className="relative h-full w-[38%] rounded-full bg-white/40" />
          </div>
          <span className="w-10 text-[11px] tabular-nums text-white/55">3:45</span>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-end gap-3 pr-2 lg:flex">
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={COMING_SOON_TITLE}
          aria-label="Lyrics"
          className={disabledControlClass}
        >
          <Mic2 className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={COMING_SOON_TITLE}
          aria-label="Queue"
          className={disabledControlClass}
        >
          <ListMusic className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={COMING_SOON_TITLE}
          aria-label="Connect to device"
          className={disabledControlClass}
        >
          <MonitorSpeaker className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2" title={COMING_SOON_TITLE}>
          <Volume2 className="h-4 w-4 text-white/30" aria-hidden="true" />
          <div className="h-1 w-[93px] cursor-not-allowed overflow-hidden rounded-full bg-white/25">
            <div className="h-full w-3/4 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
