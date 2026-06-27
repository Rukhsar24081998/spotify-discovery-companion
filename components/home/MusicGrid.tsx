import { Play } from "lucide-react";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import { COMING_SOON_TITLE, spotifyLinkProps } from "@/lib/mockBrowseContent";

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

const cardLinkClass =
  "rounded-sm transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const disabledCardClass = "cursor-default";

const gridItemWidthClass =
  "w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(20%-0.8rem)]";

const playButtonClass =
  "pointer-events-auto absolute bottom-2 right-2 z-20 flex h-12 w-12 translate-y-1 scale-90 items-center justify-center rounded-full bg-accent text-black opacity-0 shadow-[0_8px_20px_rgba(0,0,0,0.55)] transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:translate-y-0 focus-visible:scale-100";

function PlayLink({
  spotifyUrl,
  title,
  className,
}: {
  spotifyUrl: string;
  title: string;
  className: string;
}) {
  return (
    <a
      {...spotifyLinkProps(spotifyUrl, `Play ${title} on Spotify`)}
      aria-label={`Play ${title} on Spotify`}
      className={className}
    >
      <Play className="h-5 w-5 fill-black pl-0.5" aria-hidden="true" />
    </a>
  );
}

function CardText({
  item,
  linked,
  spotifyUrl,
}: {
  item: MusicGridItem;
  linked: boolean;
  spotifyUrl: string | null;
}) {
  const hasTrackMeta = Boolean(item.artist || item.album);

  return (
    <div className="relative z-10 space-y-0.5">
      {linked && spotifyUrl ? (
        <a
          {...spotifyLinkProps(spotifyUrl, `Open ${item.title} on Spotify`)}
          className={`block truncate text-[15px] font-bold leading-tight text-white hover:underline ${cardLinkClass}`}
        >
          {item.title}
        </a>
      ) : (
        <p className="truncate text-[15px] font-bold leading-tight text-white">{item.title}</p>
      )}

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

function GridCard({ item }: { item: MusicGridItem }) {
  const spotifyUrl = item.spotifyUrl;
  const linked = spotifyUrl !== null;

  return (
    <article
      title={linked ? undefined : COMING_SOON_TITLE}
      className={`group relative ${gridItemWidthClass} rounded-lg bg-[#181818] p-3.5 text-left shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-200 ${
        linked
          ? "cursor-pointer hover:-translate-y-1 hover:bg-[#282828] hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
          : `${disabledCardClass} hover:-translate-y-0.5 hover:bg-[#222222] hover:shadow-[0_8px_24px_rgba(0,0,0,0.45)]`
      }`}
    >
      {linked && spotifyUrl && (
        <a
          {...spotifyLinkProps(spotifyUrl, `Open ${item.title} on Spotify`)}
          className={`absolute inset-0 z-0 rounded-lg ${cardLinkClass}`}
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 mb-3 aspect-square w-full overflow-hidden rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {linked && spotifyUrl ? (
          <a
            {...spotifyLinkProps(spotifyUrl, `Open artwork for ${item.title} on Spotify`)}
            className={`block h-full w-full ${cardLinkClass}`}
          >
            <ArtworkImage
              src={item.imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
            />
          </a>
        ) : (
          <ArtworkImage
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        {linked && spotifyUrl && (
          <PlayLink spotifyUrl={spotifyUrl} title={item.title} className={playButtonClass} />
        )}
      </div>

      <CardText item={item} linked={linked} spotifyUrl={spotifyUrl} />
    </article>
  );
}

function PairCard({ item }: { item: MusicGridItem }) {
  const spotifyUrl = item.spotifyUrl;
  const linked = spotifyUrl !== null;

  return (
    <article
      title={linked ? undefined : COMING_SOON_TITLE}
      className={`group relative flex w-full flex-col overflow-hidden rounded-lg bg-[#181818] p-3.5 text-left shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-200 sm:flex-row sm:items-center sm:gap-4 ${
        linked
          ? "cursor-pointer hover:-translate-y-1 hover:bg-[#282828] hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
          : `${disabledCardClass} hover:-translate-y-0.5 hover:bg-[#222222]`
      }`}
    >
      {linked && spotifyUrl && (
        <a
          {...spotifyLinkProps(spotifyUrl, `Open ${item.title} on Spotify`)}
          className={`absolute inset-0 z-0 rounded-lg ${cardLinkClass}`}
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 mb-3 aspect-square w-full shrink-0 overflow-hidden rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:mb-0 sm:h-28 sm:w-28">
        {linked && spotifyUrl ? (
          <a
            {...spotifyLinkProps(spotifyUrl, `Open artwork for ${item.title} on Spotify`)}
            className={`block h-full w-full ${cardLinkClass}`}
          >
            <ArtworkImage
              src={item.imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
            />
          </a>
        ) : (
          <ArtworkImage
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        {linked && spotifyUrl && (
          <PlayLink spotifyUrl={spotifyUrl} title={item.title} className={playButtonClass} />
        )}
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <CardText item={item} linked={linked} spotifyUrl={spotifyUrl} />
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
