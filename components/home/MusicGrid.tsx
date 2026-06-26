import { Play } from "lucide-react";
import { spotifyLinkProps } from "@/lib/mockBrowseContent";

export interface MusicGridItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  spotifyUrl: string;
}

interface MusicGridProps {
  heading: string;
  items: MusicGridItem[];
  id?: string;
  showAll?: boolean;
}

const cardLinkClass =
  "rounded-sm transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/**
 * Vertical playlist-style card grid for "Made For You" sections.
 */
export function MusicGrid({ heading, items, id, showAll = false }: MusicGridProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      aria-label={headingId ? undefined : heading}
      className="mb-10"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id={headingId} className="text-2xl font-bold tracking-tight text-white">
          {heading}
        </h2>
        {showAll && (
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Coming Soon"
            className="cursor-not-allowed text-xs font-bold uppercase tracking-wide text-white/35"
          >
            Show all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="group relative cursor-pointer rounded-lg bg-[#181818] p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-[#282828] hover:shadow-[0_8px_28px_rgba(0,0,0,0.5)]"
          >
            <a
              {...spotifyLinkProps(item.spotifyUrl, `Open ${item.title} on Spotify`)}
              className={`absolute inset-0 z-0 rounded-lg ${cardLinkClass}`}
              tabIndex={-1}
              aria-hidden="true"
            />

            <a
              {...spotifyLinkProps(item.spotifyUrl, `Open artwork for ${item.title} on Spotify`)}
              className={`relative z-10 mb-4 block aspect-square w-full overflow-hidden rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.4)] ${cardLinkClass}`}
            >
              <img
                src={item.imageUrl}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                className="pointer-events-none absolute bottom-2 right-2 flex h-12 w-12 translate-y-1 scale-90 items-center justify-center rounded-full bg-accent text-black opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                aria-hidden="true"
              >
                <Play className="h-6 w-6 fill-black" />
              </span>
            </a>

            <a
              {...spotifyLinkProps(item.spotifyUrl, `Open ${item.title} on Spotify`)}
              className={`relative z-10 mb-1 block truncate text-base font-bold text-white hover:underline ${cardLinkClass}`}
            >
              {item.title}
            </a>
            <p className="relative z-10 line-clamp-2 text-sm leading-snug text-white/55">{item.subtitle}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
