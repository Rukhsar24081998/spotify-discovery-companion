import { Play } from "lucide-react";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import { GOOD_EVENING_SHORTCUTS } from "@/lib/browseSections";
import { spotifyLinkProps } from "@/lib/mockBrowseContent";

const linkClass =
  "rounded-sm transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const playButtonClass =
  "pointer-events-auto relative z-20 mr-3 flex h-10 w-10 translate-y-1 scale-90 items-center justify-center rounded-full bg-accent text-black opacity-0 shadow-[0_8px_20px_rgba(0,0,0,0.55)] transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:scale-100 focus-visible:opacity-100";

/**
 * "Good Evening" — Spotify-style horizontal shortcut tiles.
 */
export function GoodEvening() {
  return (
    <section aria-labelledby="good-evening-heading" className="mb-3">
      <h2
        id="good-evening-heading"
        className="mb-2 text-2xl font-bold tracking-tight text-white"
      >
        Good Evening
      </h2>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {GOOD_EVENING_SHORTCUTS.map((item) => (
          <article
            key={item.id}
            className="group relative flex h-14 cursor-pointer items-center overflow-hidden rounded-md bg-[#282828] shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-all duration-200 hover:bg-[#3e3e3e] hover:shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          >
            <a
              {...spotifyLinkProps(item.spotifyUrl, `Open ${item.label} on Spotify`)}
              className={`absolute inset-0 z-0 ${linkClass}`}
              tabIndex={-1}
              aria-hidden="true"
            />

            <div className="relative z-10 h-14 w-14 shrink-0 overflow-hidden shadow-[2px_0_8px_rgba(0,0,0,0.35)]">
              <ArtworkImage
                src={item.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <a
              {...spotifyLinkProps(item.spotifyUrl, `Open ${item.label} on Spotify`)}
              className={`relative z-10 min-w-0 flex-1 truncate px-4 text-sm font-bold text-white hover:underline ${linkClass}`}
            >
              {item.label}
            </a>

            <a
              {...spotifyLinkProps(item.spotifyUrl, `Play ${item.label} on Spotify`)}
              aria-label={`Play ${item.label} on Spotify`}
              className={playButtonClass}
            >
              <Play className="h-4 w-4 fill-black pl-0.5" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
