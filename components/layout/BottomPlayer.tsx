"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import { spotifyLinkProps } from "@/lib/mockBrowseContent";

export type NowSelectedType = "Track" | "Album" | "Playlist";

export interface NowSelectedItem {
  id: string;
  title: string;
  artist?: string;
  type: NowSelectedType;
  imageUrl: string;
  spotifyUrl: string;
}

const INITIAL_NOW_SELECTED: NowSelectedItem = {
  id: "do-i-wanna-know",
  title: "Do I Wanna Know?",
  artist: "Arctic Monkeys",
  type: "Track",
  imageUrl: "/images/albums/am.jpg",
  spotifyUrl: "https://open.spotify.com/track/5FVd6KXrgO9B3JPmC8OPst",
};

interface NowSelectedContextValue {
  selected: NowSelectedItem;
  selectItem: (item: NowSelectedItem) => void;
}

const NowSelectedContext = createContext<NowSelectedContextValue | null>(null);

export function useNowSelected(): NowSelectedContextValue {
  const context = useContext(NowSelectedContext);
  if (!context) {
    throw new Error("useNowSelected must be used within NowSelectedProvider");
  }
  return context;
}

/** Infer catalog type from grid item metadata. */
export function inferGridItemType(item: {
  title: string;
  artist?: string;
  album?: string;
}): NowSelectedType {
  if (!item.artist) {
    return "Playlist";
  }
  if (item.album && item.title === item.album) {
    return "Album";
  }
  return "Track";
}

/** Build a Now Selected payload from a homepage grid card. */
export function nowSelectedFromGridItem(
  item: {
    id: string;
    title: string;
    subtitle: string;
    artist?: string;
    album?: string;
    imageUrl: string;
  },
  spotifyUrl: string,
): NowSelectedItem {
  const type = inferGridItemType(item);
  return {
    id: item.id,
    title: item.title,
    artist: type === "Playlist" ? item.subtitle || undefined : item.artist,
    type,
    imageUrl: item.imageUrl,
    spotifyUrl,
  };
}

/** Open a Spotify URL in a new browser tab. */
export function openSpotifyUrl(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

interface NowSelectedProviderProps {
  children: ReactNode;
}

export function NowSelectedProvider({ children }: NowSelectedProviderProps) {
  const [selected, setSelected] = useState<NowSelectedItem>(INITIAL_NOW_SELECTED);

  const selectItem = useCallback((item: NowSelectedItem) => {
    setSelected(item);
  }, []);

  const contextValue = useMemo(
    () => ({ selected, selectItem }),
    [selected, selectItem],
  );

  return (
    <NowSelectedContext.Provider value={contextValue}>
      {children}
      <NowSelectedPanel item={selected} />
    </NowSelectedContext.Provider>
  );
}

/** @deprecated Use NowSelectedProvider */
export const PlaybackProvider = NowSelectedProvider;

function NowSelectedPanel({ item }: { item: NowSelectedItem }) {
  return (
    <footer
      aria-label="Now selected"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center justify-between gap-4 border-t border-[#282828] bg-[#181818] px-4 sm:px-5"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <ArtworkImage
          src={item.imageUrl}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-md object-cover shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
        />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
            Now Selected
          </p>
          <p className="truncate text-sm font-medium leading-tight text-white sm:text-[15px]">
            {item.title}
          </p>
          {item.artist && (
            <p className="truncate text-xs text-white/60 sm:text-[13px]">{item.artist}</p>
          )}
          <p className="truncate text-xs text-white/40">{item.type}</p>
        </div>
      </div>

      <a
        {...spotifyLinkProps(item.spotifyUrl, `Open ${item.title} on Spotify`)}
        className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-accent px-4 py-2 text-xs font-bold text-black shadow-[0_4px_16px_rgba(29,185,84,0.3)] transition-all duration-150 hover:bg-accent-hover hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] active:scale-[0.98] sm:px-5 sm:text-sm"
      >
        Open in Spotify
        <span aria-hidden="true">→</span>
      </a>
    </footer>
  );
}
