import { Play, Sparkles } from "lucide-react";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import {
  ARTWORK_PLACEHOLDER_SRC,
  DISCOVERY_INSIGHTS,
  resolveMusicSpotifyLink,
  spotifyLinkProps,
} from "@/lib/mockBrowseContent";

const linkClass =
  "rounded-sm transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const playButtonClass =
  "pointer-events-auto absolute bottom-3 right-3 z-20 flex h-12 w-12 translate-y-1 scale-90 items-center justify-center rounded-full bg-accent text-black opacity-0 shadow-[0_8px_20px_rgba(0,0,0,0.55)] transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:scale-100 focus-visible:opacity-100";

function getArtworkUrl(): string {
  return (
    DISCOVERY_INSIGHTS.mix?.imageUrl ??
    DISCOVERY_INSIGHTS.fallbackTrack?.imageUrl ??
    ARTWORK_PLACEHOLDER_SRC
  );
}

function getSpotifyUrl(): string {
  const mix = DISCOVERY_INSIGHTS.mix;
  const fallback = DISCOVERY_INSIGHTS.fallbackTrack;
  if (mix) {
    return resolveMusicSpotifyLink(mix.spotifyUrl, mix.title);
  }
  if (fallback) {
    return resolveMusicSpotifyLink(fallback.spotifyUrl, fallback.title);
  }
  return resolveMusicSpotifyLink(null, "AI Picks");
}

function getTitle(): string {
  return (
    DISCOVERY_INSIGHTS.mix?.title ??
    DISCOVERY_INSIGHTS.fallbackTrack?.title ??
    "Recommendation"
  );
}

/**
 * Single premium AI recommendation shelf — integrated homepage section.
 */
export function AiPickForYou() {
  const { mix, matchScore, cardExplanation } = DISCOVERY_INSIGHTS;
  if (!mix) {
    return null;
  }

  const artworkUrl = getArtworkUrl();
  const spotifyUrl = getSpotifyUrl();
  const title = getTitle();

  return (
    <section aria-labelledby="ai-pick-heading" className="mb-3">
      <div className="mb-2">
        <h2
          id="ai-pick-heading"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white"
        >
          <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
          AI Pick For You
        </h2>
        <p className="mt-1 text-sm text-white/55">Based on your recent listening habits</p>
      </div>

      <article className="group relative flex flex-col overflow-hidden rounded-lg bg-[#181818] shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#282828] hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)] sm:flex-row sm:items-stretch">
        <a
          {...spotifyLinkProps(spotifyUrl, `Open ${title} on Spotify`)}
          className={`absolute inset-0 z-0 rounded-lg ${linkClass}`}
          tabIndex={-1}
          aria-hidden="true"
        />

        <div className="relative z-10 aspect-square w-full shrink-0 overflow-hidden sm:w-[220px] md:w-[260px] lg:w-[280px]">
          <a
            {...spotifyLinkProps(spotifyUrl, `Open artwork for ${title} on Spotify`)}
            className={`block h-full w-full ${linkClass}`}
          >
            <ArtworkImage
              src={artworkUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
            />
          </a>
          <a
            {...spotifyLinkProps(spotifyUrl, `Play ${title} on Spotify`)}
            aria-label={`Play ${title} on Spotify`}
            className={playButtonClass}
          >
            <Play className="h-5 w-5 fill-black pl-0.5" aria-hidden="true" />
          </a>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center gap-3 p-5 sm:p-6">
          <div>
            <a
              {...spotifyLinkProps(spotifyUrl, `Open ${title} on Spotify`)}
              className={`text-xl font-bold text-white hover:underline md:text-2xl ${linkClass}`}
            >
              {title}
            </a>
            {mix.subtitle && (
              <p className="mt-1 text-sm text-white/55">{mix.subtitle}</p>
            )}
            <p className="mt-1.5 inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
              {matchScore}% Match
            </p>
          </div>

          <p className="max-w-xl text-[15px] leading-relaxed text-white/65">{cardExplanation}</p>

          <a
            {...spotifyLinkProps(spotifyUrl, `Open ${title} on Spotify`)}
            className={`inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-black shadow-[0_4px_16px_rgba(29,185,84,0.3)] transition-all duration-200 hover:scale-[1.02] hover:bg-accent-hover hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] active:scale-[0.98] ${linkClass}`}
          >
            <Play className="h-4 w-4 fill-black" aria-hidden="true" />
            Open in Spotify
          </a>
        </div>
      </article>
    </section>
  );
}
