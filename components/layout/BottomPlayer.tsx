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
      className="fixed inset-x-0 bottom-14 z-40 flex h-16 items-center justify-between gap-3 border-t border-[#282828] bg-[#181818] px-3 md:bottom-0 md:h-[72px] md:gap-4 md:px-4 xl:px-5"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4 xl:gap-5">
        {item ? (
          <>
            <ArtworkImage
              src={item.imageUrl}
              alt=""
              width={56}
              height={56}
              className="h-10 w-10 shrink-0 rounded-md object-cover shadow-[0_4px_16px_rgba(0,0,0,0.45)] md:h-14 md:w-14"
            />
            <div className="min-w-0 space-y-0.5">
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.12em] text-white/45 md:block">
                Now Selected
              </p>
              <p className="truncate text-sm font-medium leading-tight text-white xl:text-[15px]">
                {item.title}
              </p>
              {item.artist && (
                <p className="truncate text-xs leading-snug text-white/60 md:block xl:text-[13px]">
                  {item.artist}
                </p>
              )}
              <p className="hidden truncate text-xs text-white/40 md:block">
                {item.type} • Spotify
              </p>
            </div>
          </>
        ) : (
          <div className="min-w-0 space-y-0.5">
            <p className="truncate text-xs font-medium leading-tight text-white/70 md:text-sm xl:text-[15px]">
              {emptyState === "recommendations"
                ? "Select a recommendation to continue in Spotify."
                : "Nothing selected yet"}
            </p>
            {emptyState === "browse" && (
              <p className="hidden text-xs leading-snug text-white/45 md:block xl:text-[13px]">
                Choose an album, playlist or track to continue in Spotify.
              </p>
            )}
          </div>
        )}
      </div>

      {item && (
        <a
          {...spotifyLinkProps(item.spotifyUrl, `Open ${item.title} on Spotify`)}
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold text-black shadow-[0_4px_16px_rgba(29,185,84,0.3)] transition-all duration-200 ease-out hover:bg-accent-hover hover:brightness-110 hover:shadow-[0_6px_24px_rgba(29,185,84,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] active:scale-[0.98] md:px-4 md:py-2 md:text-xs xl:px-5 xl:text-sm"
        >
          <span className="md:hidden" aria-hidden="true">
            Spotify
          </span>
          <span className="hidden md:inline">Open in Spotify</span>
          <span aria-hidden="true">→</span>
        </a>
      )}
    </footer>
  );
}
