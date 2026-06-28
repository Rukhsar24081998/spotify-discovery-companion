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

interface NowSelectedContextValue {
  selected: NowSelectedItem | null;
  selectItem: (item: NowSelectedItem) => void;
}

/** Shared homepage card interaction classes. */
export const homeSelectableCardClass =
  "cursor-pointer transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818]";

export const homeSelectedCardClass = "ring-2 ring-accent";

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

/** Build a Now Selected payload from a discovery recommendation card. */
export function nowSelectedFromRecommendation(recommendation: {
  trackId: string;
  title: string;
  artist: string;
  albumArt: string;
  spotifyUrl: string;
}): NowSelectedItem {
  return {
    id: recommendation.trackId,
    title: recommendation.title,
    artist: recommendation.artist,
    type: "Track",
    imageUrl: recommendation.albumArt,
    spotifyUrl: recommendation.spotifyUrl,
  };
}

/** Open a Spotify URL in a new browser tab. */
export function openSpotifyUrl(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

interface NowSelectedProviderProps {
  children: ReactNode;
  /** Empty footer copy — browse for home, recommendations for discover. */
  emptyState?: "browse" | "recommendations";
}

export function NowSelectedProvider({
  children,
  emptyState = "browse",
}: NowSelectedProviderProps) {
  const [selected, setSelected] = useState<NowSelectedItem | null>(null);

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
      <NowSelectedPanel item={selected} emptyState={emptyState} />
    </NowSelectedContext.Provider>
  );
}

/** @deprecated Use NowSelectedProvider */
export const PlaybackProvider = NowSelectedProvider;

function NowSelectedPanel({
  item,
  emptyState,
}: {
  item: NowSelectedItem | null;
  emptyState: "browse" | "recommendations";
}) {
  return (
    <footer
      aria-label="Now selected"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center justify-between gap-4 border-t border-[#282828] bg-[#181818] px-4 sm:px-5"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
        {item ? (
          <>
            <ArtworkImage
              src={item.imageUrl}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-md object-cover shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
            />
            <div className="min-w-0 space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                Now Selected
              </p>
              <p className="truncate text-sm font-medium leading-tight text-white sm:text-[15px]">
                {item.title}
              </p>
              {item.artist && (
                <p className="truncate text-xs leading-snug text-white/60 sm:text-[13px]">
                  {item.artist}
                </p>
              )}
              <p className="truncate text-xs text-white/40">{item.type} • Spotify</p>
            </div>
          </>
        ) : (
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium leading-tight text-white/70 sm:text-[15px]">
              {emptyState === "recommendations"
                ? "Select a recommendation to continue in Spotify."
                : "Nothing selected yet"}
            </p>
            {emptyState === "browse" && (
              <p className="text-xs leading-snug text-white/45 sm:text-[13px]">
                Choose an album, playlist or track to continue in Spotify.
              </p>
            )}
          </div>
        )}
      </div>

      {item && (
        <a
          {...spotifyLinkProps(item.spotifyUrl, `Open ${item.title} on Spotify`)}
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-accent px-4 py-2 text-xs font-bold text-black shadow-[0_4px_16px_rgba(29,185,84,0.3)] transition-all duration-200 ease-out hover:bg-accent-hover hover:brightness-110 hover:shadow-[0_6px_24px_rgba(29,185,84,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] active:scale-[0.98] sm:px-5 sm:text-sm"
        >
          Open in Spotify
          <span aria-hidden="true">→</span>
        </a>
      )}
    </footer>
  );
}
