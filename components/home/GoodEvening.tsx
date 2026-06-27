"use client";

import { ArtworkImage } from "@/components/ui/ArtworkImage";
import { useNowSelected, openSpotifyUrl, type NowSelectedItem } from "@/components/layout/BottomPlayer";
import { CATALOG_ALBUMS } from "@/lib/mockBrowseCatalog";
import { GOOD_EVENING_SHORTCUTS } from "@/lib/browseSections";
import type { ShortcutItem } from "@/lib/mockBrowseCatalog";

const selectableClass =
  "cursor-pointer rounded-md transition-all duration-200 hover:bg-[#3e3e3e] hover:shadow-[0_8px_24px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

function shortcutToNowSelected(item: ShortcutItem): NowSelectedItem {
  const isPlaylist = item.spotifyUrl.includes("/search/");

  if (isPlaylist) {
    return {
      id: item.id,
      title: item.label,
      type: "Playlist",
      imageUrl: item.imageUrl,
      spotifyUrl: item.spotifyUrl,
    };
  }

  const albumId = item.id.replace(/^shortcut-/, "");
  const album = CATALOG_ALBUMS.find((entry) => entry.id === albumId);

  return {
    id: item.id,
    title: item.label,
    artist: album?.artist,
    type: "Album",
    imageUrl: item.imageUrl,
    spotifyUrl: item.spotifyUrl,
  };
}

function handleShortcutSelect(
  item: ShortcutItem,
  selectItem: (item: NowSelectedItem) => void,
) {
  const selected = shortcutToNowSelected(item);
  selectItem(selected);
  openSpotifyUrl(selected.spotifyUrl);
}

/**
 * "Good Evening" — Spotify-style horizontal shortcut tiles.
 */
export function GoodEvening() {
  const { selectItem } = useNowSelected();

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
            role="button"
            tabIndex={0}
            onClick={() => handleShortcutSelect(item, selectItem)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleShortcutSelect(item, selectItem);
              }
            }}
            className={`group relative flex h-14 items-center overflow-hidden bg-[#282828] shadow-[0_2px_8px_rgba(0,0,0,0.35)] ${selectableClass}`}
          >
            <div className="relative z-10 h-14 w-14 shrink-0 overflow-hidden shadow-[2px_0_8px_rgba(0,0,0,0.35)]">
              <ArtworkImage
                src={item.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <p className="relative z-10 min-w-0 flex-1 truncate px-4 text-sm font-bold text-white">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
