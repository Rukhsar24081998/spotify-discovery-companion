"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_BOTTOM_PLAYER_QUEUE,
  spotifyLinkProps,
  type BottomPlayerTrack,
} from "@/lib/mockBrowseContent";
import { ArtworkImage } from "@/components/ui/ArtworkImage";

interface PlaybackContextValue {
  playTrack: (track: BottomPlayerTrack) => void;
}

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

export function usePlayback(): PlaybackContextValue {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within PlaybackProvider");
  }
  return context;
}

interface PlaybackProviderProps {
  children: ReactNode;
}

export function PlaybackProvider({ children }: PlaybackProviderProps) {
  const [track, setTrack] = useState<BottomPlayerTrack>(INITIAL_BOTTOM_PLAYER_QUEUE[0]);

  const playTrack = useCallback((incoming: BottomPlayerTrack) => {
    setTrack(incoming);
  }, []);

  const contextValue = useMemo(() => ({ playTrack }), [playTrack]);

  const albumLine = `${track.album}${track.releaseYear ? ` · ${track.releaseYear}` : ""}`;

  return (
    <PlaybackContext.Provider value={contextValue}>
      {children}
      <footer
        aria-label="Now selected"
        className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center justify-between gap-4 border-t border-[#282828] bg-[#181818] px-4 sm:px-5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <ArtworkImage
            src={track.imageUrl}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-md object-cover shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
          />
          <div className="min-w-0 space-y-0.5">
            <p className="truncate text-sm font-medium leading-tight text-white sm:text-[15px]">
              {track.title}
            </p>
            <p className="truncate text-xs text-white/60 sm:text-[13px]">{track.artist}</p>
            <p className="hidden truncate text-xs text-white/40 sm:block">{albumLine}</p>
          </div>
        </div>

        <a
          {...spotifyLinkProps(track.trackSpotifyUrl, `Open ${track.title} on Spotify`)}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-4 py-2 text-xs font-bold text-black shadow-[0_4px_16px_rgba(29,185,84,0.3)] transition-all duration-150 hover:bg-accent-hover hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] active:scale-[0.98] sm:px-5 sm:text-sm"
        >
          Open in Spotify
        </a>
      </footer>
    </PlaybackContext.Provider>
  );
}
