/** Curated static browse content — local artwork assets in /public/images (display only). */

import {
  CATALOG_ALBUMS,
  CATALOG_TRACKS,
  catalogAlbumLink,
} from "@/lib/mockBrowseCatalog";
import { resolveSpotifyLink } from "@/lib/spotifyLinks";

export const SPOTIFY_WEB_URL = "https://open.spotify.com";

/** Local fallback when artwork fails to load. */
export const ARTWORK_PLACEHOLDER_SRC = "/images/placeholders/music-placeholder.png";

/** Tooltip copy for unavailable UI controls. */
export const COMING_SOON_TITLE = "Coming Soon";

export interface RecentlyPlayedItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  releaseYear?: number;
  imageUrl: string;
  albumSpotifyUrl: string | null;
  trackSpotifyUrl: string | null;
  artistSpotifyUrl: string | null;
}

export interface PlaylistGridItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  spotifyUrl: string | null;
}

function trackById(id: string) {
  const track = CATALOG_TRACKS.find((item) => item.id === id);
  if (!track) {
    throw new Error(`Unknown track id: ${id}`);
  }
  const album = CATALOG_ALBUMS.find((item) => item.id === track.albumId);
  if (!album) {
    throw new Error(`Unknown album id: ${track.albumId}`);
  }
  return { track, album };
}

export const RECENTLY_PLAYED: RecentlyPlayedItem[] = [
  (() => {
    const { track, album } = trackById("mirror-ball");
    return {
      id: "arctic-monkeys",
      title: track.title,
      artist: album.artist,
      album: album.title,
      releaseYear: album.releaseYear,
      imageUrl: track.imageUrl,
      albumSpotifyUrl: album.albumSpotifyUrl,
      trackSpotifyUrl: track.trackSpotifyUrl,
      artistSpotifyUrl: album.artistSpotifyUrl,
    };
  })(),
  (() => {
    const { track, album } = trackById("kill-bill");
    return {
      id: "sza",
      title: track.title,
      artist: album.artist,
      album: album.title,
      releaseYear: album.releaseYear,
      imageUrl: track.imageUrl,
      albumSpotifyUrl: album.albumSpotifyUrl,
      trackSpotifyUrl: track.trackSpotifyUrl,
      artistSpotifyUrl: album.artistSpotifyUrl,
    };
  })(),
  (() => {
    const { track, album } = trackById("anti-hero");
    return {
      id: "taylor-swift",
      title: track.title,
      artist: album.artist,
      album: album.title,
      releaseYear: album.releaseYear,
      imageUrl: track.imageUrl,
      albumSpotifyUrl: album.albumSpotifyUrl,
      trackSpotifyUrl: track.trackSpotifyUrl,
      artistSpotifyUrl: album.artistSpotifyUrl,
    };
  })(),
  (() => {
    const { track, album } = trackById("take-my-breath");
    return {
      id: "the-weeknd",
      title: track.title,
      artist: album.artist,
      album: album.title,
      releaseYear: album.releaseYear,
      imageUrl: track.imageUrl,
      albumSpotifyUrl: album.albumSpotifyUrl,
      trackSpotifyUrl: track.trackSpotifyUrl,
      artistSpotifyUrl: album.artistSpotifyUrl,
    };
  })(),
];

/** Personalized Spotify mixes cannot use static playlist IDs — links disabled in UI. */
export { MADE_FOR_YOU_SHELF as MADE_FOR_YOU } from "@/lib/browseSections";

export {
  CATALOG_ALBUMS,
  CATALOG_ARTISTS,
  CATALOG_PLAYLISTS,
  CATALOG_TRACKS,
} from "@/lib/mockBrowseCatalog";

const blindingLights = trackById("blinding-lights");

export const NOW_PLAYING = {
  title: blindingLights.track.title,
  artist: blindingLights.album.artist,
  album: blindingLights.album.title,
  releaseYear: blindingLights.album.releaseYear,
  imageUrl: blindingLights.album.imageUrl,
  trackSpotifyUrl: blindingLights.track.trackSpotifyUrl,
  artistSpotifyUrl: blindingLights.album.artistSpotifyUrl,
  albumSpotifyUrl: blindingLights.album.albumSpotifyUrl,
};

/** Track payload for the bottom player bar. */
export interface BottomPlayerTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  releaseYear?: number;
  imageUrl: string;
  durationSeconds: number;
  previewUrl: string | null;
  trackSpotifyUrl: string;
  artistSpotifyUrl: string;
  albumSpotifyUrl: string | null;
}

export type MockPlayerTrack = Omit<BottomPlayerTrack, "previewUrl">;

function toBottomPlayerTrack(
  trackId: string,
  previewUrl: string | null = null,
): BottomPlayerTrack {
  const { track, album } = trackById(trackId);
  return {
    id: track.id,
    title: track.title,
    artist: album.artist,
    album: album.title,
    releaseYear: album.releaseYear,
    imageUrl: album.imageUrl,
    durationSeconds: track.durationSeconds,
    previewUrl,
    trackSpotifyUrl: track.trackSpotifyUrl,
    artistSpotifyUrl: album.artistSpotifyUrl,
    albumSpotifyUrl: album.albumSpotifyUrl,
  };
}

function toMockPlayerTrack(trackId: string): MockPlayerTrack {
  const { id, title, artist, album, releaseYear, imageUrl, durationSeconds, trackSpotifyUrl, artistSpotifyUrl, albumSpotifyUrl } =
    toBottomPlayerTrack(trackId);
  return {
    id,
    title,
    artist,
    album,
    releaseYear,
    imageUrl,
    durationSeconds,
    trackSpotifyUrl,
    artistSpotifyUrl,
    albumSpotifyUrl,
  };
}

/** Build a bottom-player payload from a catalog track id. */
export function bottomPlayerTrackFromTrackId(trackId: string): BottomPlayerTrack {
  return toBottomPlayerTrack(trackId, null);
}

/** Build a bottom-player payload from a catalog album id (no preview). */
export function bottomPlayerTrackFromAlbumId(albumId: string): BottomPlayerTrack {
  const album = CATALOG_ALBUMS.find((item) => item.id === albumId);
  if (!album) {
    throw new Error(`Unknown album id: ${albumId}`);
  }
  return {
    id: album.id,
    title: album.title,
    artist: album.artist,
    album: album.title,
    releaseYear: album.releaseYear,
    imageUrl: album.imageUrl,
    durationSeconds: 0,
    previewUrl: null,
    trackSpotifyUrl: album.albumSpotifyUrl,
    artistSpotifyUrl: album.artistSpotifyUrl,
    albumSpotifyUrl: album.albumSpotifyUrl,
  };
}

/** Build a bottom-player payload from a playlist shelf item (no preview). */
export function bottomPlayerTrackFromPlaylist(
  playlist: { id: string; title: string; subtitle: string; imageUrl: string; spotifyUrl: string },
): BottomPlayerTrack {
  return {
    id: playlist.id,
    title: playlist.title,
    artist: playlist.subtitle,
    album: playlist.title,
    imageUrl: playlist.imageUrl,
    durationSeconds: 0,
    previewUrl: null,
    trackSpotifyUrl: playlist.spotifyUrl,
    artistSpotifyUrl: playlist.spotifyUrl,
    albumSpotifyUrl: null,
  };
}

export const MOCK_PLAYER_PLAYLIST: MockPlayerTrack[] = [
  toMockPlayerTrack("blinding-lights"),
  toMockPlayerTrack("take-my-breath"),
  toMockPlayerTrack("kill-bill"),
  toMockPlayerTrack("anti-hero"),
  toMockPlayerTrack("mirror-ball"),
];

export const INITIAL_BOTTOM_PLAYER_QUEUE: BottomPlayerTrack[] =
  MOCK_PLAYER_PLAYLIST.map((track) => ({
    ...track,
    previewUrl: null,
  }));

const amCatalogAlbum = CATALOG_ALBUMS.find((album) => album.id === "am");

export const DISCOVERY_INSIGHTS = {
  recentListening: ["Arctic Monkeys", "Indie Rock", "The Strokes"],
  matchScore: 94,
  cardExplanation:
    "You've been spinning Arctic Monkeys, Tame Impala, and indie rock — AM is the natural next album in your rotation.",
  pitch:
    "Same late-night swagger as Favourite Worst Nightmare and Currents, with a sharper groove you haven't worn out yet.",
  recommendationReason: "Recommended because it matches your indie and alt-rock listening streak.",
  reasons: [
    "Same indie rock energy",
    "Familiar Arctic Monkeys vocals",
    "Pairs with Currents and After Hours",
    "Album you haven't finished yet",
  ],
  mix: {
    title: "AM",
    subtitle: "Arctic Monkeys · 2013",
    imageUrl: amCatalogAlbum?.imageUrl ?? "/images/albums/am.jpg",
    spotifyUrl: catalogAlbumLink("am"),
  },
  fallbackTrack: null as {
    title: string;
    imageUrl: string;
    spotifyUrl: string;
  } | null,
};

const spotifyLinkClass =
  "rounded-sm transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/** Shared anchor props for opening Spotify in a new tab. */
export function spotifyLinkProps(href: string, label: string) {
  return {
    href,
    target: "_blank" as const,
    rel: "noopener noreferrer",
    className: spotifyLinkClass,
    "aria-label": label,
  };
}

/** Resolve a Spotify destination for recommendation / AI cards. */
export function resolveMusicSpotifyLink(
  apiUrl: string | null | undefined,
  searchName: string,
): string {
  return resolveSpotifyLink(apiUrl, searchName);
}
