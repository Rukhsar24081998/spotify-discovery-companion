import { Play } from "lucide-react";
import { RECENTLY_PLAYED, spotifyLinkProps } from "@/lib/mockBrowseContent";

const cardLinkClass =
  "rounded-sm transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/**
 * "Good Evening" shortcut grid from the home mockup (2×2 horizontal cards).
 */
export function RecentlyPlayed() {
  return (
    <section aria-labelledby="good-evening-heading" className="mb-10">
      <h2 id="good-evening-heading" className="mb-4 text-2xl font-bold tracking-tight text-white">
        Good Evening
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {RECENTLY_PLAYED.map((item) => (
          <article
            key={item.id}
            className="group relative flex h-[68px] cursor-pointer overflow-hidden rounded-md bg-[#282828] text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3e3e3e] hover:shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          >
            <a
              {...spotifyLinkProps(
                item.albumSpotifyUrl,
                `Open ${item.title} by ${item.artist} on Spotify`,
              )}
              className={`absolute inset-0 z-0 ${cardLinkClass}`}
              tabIndex={-1}
              aria-hidden="true"
            />

            <a
              {...spotifyLinkProps(
                item.albumSpotifyUrl,
                `Open album artwork for ${item.title} on Spotify`,
              )}
              className={`relative z-10 h-full w-[68px] shrink-0 ${cardLinkClass}`}
            >
              <img
                src={item.imageUrl}
                alt=""
                width={68}
                height={68}
                loading="lazy"
                className="h-full w-full object-cover shadow-[2px_0_8px_rgba(0,0,0,0.3)]"
              />
            </a>

            <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-4">
              <a
                {...spotifyLinkProps(item.trackSpotifyUrl, `Open ${item.title} on Spotify`)}
                className={`truncate text-sm font-bold text-white hover:underline ${cardLinkClass}`}
              >
                {item.title}
              </a>
              <a
                {...spotifyLinkProps(item.artistSpotifyUrl, `Open ${item.artist} on Spotify`)}
                className={`truncate text-xs text-white/55 hover:text-white hover:underline ${cardLinkClass}`}
              >
                {item.artist}
              </a>
            </div>

            <a
              {...spotifyLinkProps(item.trackSpotifyUrl, `Play ${item.title} on Spotify`)}
              className={`absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 translate-x-2 scale-90 items-center justify-center rounded-full bg-accent text-black opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 ${cardLinkClass}`}
            >
              <Play className="h-5 w-5 fill-black" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
