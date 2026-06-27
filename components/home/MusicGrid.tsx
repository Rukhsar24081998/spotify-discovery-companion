"use client";

import type { KeyboardEvent } from "react";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import {
  nowSelectedFromGridItem,
  openSpotifyUrl,
  useNowSelected,
} from "@/components/layout/BottomPlayer";
import { COMING_SOON_TITLE } from "@/lib/mockBrowseContent";

export interface MusicGridItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  spotifyUrl: string | null;
  artist?: string;
  album?: string;
  releaseYear?: number;
}

interface MusicGridProps {
  heading: string;
  items: MusicGridItem[];
  id?: string;
  showAll?: boolean;
}

const disabledCardClass = "cursor-default";

const selectableCardClass =
  "cursor-pointer hover:-translate-y-1 hover:bg-[#282828] hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const gridItemWidthClass =
  "w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(20%-0.8rem)]";

function CardText({ item }: { item: MusicGridItem }) {
  const hasTrackMeta = Boolean(item.artist || item.album);

  return (
    <div className="relative z-10 space-y-0.5">
      <p className="truncate text-[15px] font-bold leading-tight text-white">{item.title}</p>

      {hasTrackMeta ? (
        <>
          {item.artist && (
            <p className="truncate text-[13px] text-white/65">{item.artist}</p>
          )}
          {item.album && (
            <p className="truncate text-xs text-white/45">
              {item.album}
              {item.releaseYear ? ` · ${item.releaseYear}` : ""}
            </p>
          )}
        </>
      ) : (
        <p className="line-clamp-2 text-[13px] leading-snug text-white/55">{item.subtitle}</p>
      )}
    </div>
  );
}

function useSelectGridItem(item: MusicGridItem) {
  const { selectItem } = useNowSelected();
  const spotifyUrl = item.spotifyUrl;
  const linked = spotifyUrl !== null;

  const handleSelect = () => {
    if (!linked || !spotifyUrl) {
      return;
    }
    selectItem(nowSelectedFromGridItem(item, spotifyUrl));
    openSpotifyUrl(spotifyUrl);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect();
    }
  };

  return { linked, handleSelect, handleKeyDown };
}

function GridCard({ item }: { item: MusicGridItem }) {
  const { linked, handleSelect, handleKeyDown } = useSelectGridItem(item);

  return (
    <article
      title={linked ? undefined : COMING_SOON_TITLE}
      role={linked ? "button" : undefined}
      tabIndex={linked ? 0 : -1}
      onClick={linked ? handleSelect : undefined}
      onKeyDown={linked ? handleKeyDown : undefined}
      className={`group relative ${gridItemWidthClass} rounded-lg bg-[#181818] p-3.5 text-left shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-200 ${
        linked
          ? selectableCardClass
          : `${disabledCardClass} hover:-translate-y-0.5 hover:bg-[#222222] hover:shadow-[0_8px_24px_rgba(0,0,0,0.45)]`
      }`}
    >
      <div className="relative z-10 mb-3 aspect-square w-full overflow-hidden rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <ArtworkImage
          src={item.imageUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
        />
      </div>

      <CardText item={item} />
    </article>
  );
}

function PairCard({ item }: { item: MusicGridItem }) {
  const { linked, handleSelect, handleKeyDown } = useSelectGridItem(item);

  return (
    <article
      title={linked ? undefined : COMING_SOON_TITLE}
      role={linked ? "button" : undefined}
      tabIndex={linked ? 0 : -1}
      onClick={linked ? handleSelect : undefined}
      onKeyDown={linked ? handleKeyDown : undefined}
      className={`group relative flex w-full flex-col overflow-hidden rounded-lg bg-[#181818] p-3.5 text-left shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-200 sm:flex-row sm:items-center sm:gap-4 ${
        linked
          ? selectableCardClass
          : `${disabledCardClass} hover:-translate-y-0.5 hover:bg-[#222222]`
      }`}
    >
      <div className="relative z-10 mb-3 aspect-square w-full shrink-0 overflow-hidden rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:mb-0 sm:h-28 sm:w-28">
        <ArtworkImage
          src={item.imageUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
        />
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <CardText item={item} />
      </div>
    </article>
  );
}

/**
 * Vertical playlist-style card grid for browse sections.
 */
export function MusicGrid({ heading, items, id, showAll = false }: MusicGridProps) {
  const headingId = id ? `${id}-heading` : undefined;
  const layout = items.length === 2 ? "pair" : "grid";

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      aria-label={headingId ? undefined : heading}
      className="mb-3"
    >
      <div className="mb-2 flex items-center justify-between gap-4">
        <h2 id={headingId} className="text-2xl font-bold tracking-tight text-white">
          {heading}
        </h2>
        {showAll && (
          <button
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TITLE}
            className="cursor-not-allowed text-xs font-bold uppercase tracking-wide text-white/35"
          >
            Show all
          </button>
        )}
      </div>

      {layout === "pair" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {items.map((item) => (
            <PairCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {layout === "grid" && (
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          {items.map((item) => (
            <GridCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
