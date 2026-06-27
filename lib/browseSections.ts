/** Homepage shelf slices derived from the browse catalog. */

import type { MusicGridItem } from "@/components/home/MusicGrid";
import {
  CATALOG_ALBUMS,
  CATALOG_PLAYLISTS,
  CATALOG_TRACKS,
  catalogAlbumLink,
  fictionalPlaylistLink,
  type CatalogAlbum,
  type CatalogPlaylist,
  type CatalogTrack,
  type ShortcutItem,
} from "@/lib/mockBrowseCatalog";

const albumById = new Map(CATALOG_ALBUMS.map((album) => [album.id, album]));

function resolveAlbum(albumId: string): CatalogAlbum {
  const album = albumById.get(albumId);
  if (!album) {
    throw new Error(`Unknown album id: ${albumId}`);
  }
  return album;
}

function shortcutFromAlbum(id: string, albumId: string, label?: string): ShortcutItem {
  const album = resolveAlbum(albumId);
  return {
    id,
    label: label ?? album.title,
    imageUrl: album.imageUrl,
    spotifyUrl: catalogAlbumLink(albumId),
  };
}

export function albumToGridItem(album: CatalogAlbum): MusicGridItem {
  return {
    id: album.id,
    title: album.title,
    subtitle: album.artist,
    artist: album.artist,
    album: album.title,
    releaseYear: album.releaseYear,
    imageUrl: album.imageUrl,
    spotifyUrl: album.albumSpotifyUrl,
  };
}

export function trackToGridItem(track: CatalogTrack): MusicGridItem {
  const album = resolveAlbum(track.albumId);
  return {
    id: track.id,
    title: track.title,
    subtitle: album.artist,
    artist: album.artist,
    album: album.title,
    releaseYear: album.releaseYear,
    imageUrl: track.imageUrl,
    spotifyUrl: track.trackSpotifyUrl,
  };
}

export function playlistToGridItem(playlist: CatalogPlaylist): MusicGridItem {
  return {
    id: playlist.id,
    title: playlist.title,
    subtitle: playlist.subtitle,
    imageUrl: playlist.imageUrl,
    spotifyUrl: playlist.spotifyUrl,
  };
}

function pickPlaylists(ids: string[]): MusicGridItem[] {
  return ids.map((id) => {
    const playlist = CATALOG_PLAYLISTS.find((item) => item.id === id);
    if (!playlist) {
      throw new Error(`Unknown playlist id: ${id}`);
    }
    return playlistToGridItem(playlist);
  });
}

function pickAlbums(count: number, offset = 0): MusicGridItem[] {
  return CATALOG_ALBUMS.slice(offset, offset + count).map(albumToGridItem);
}

function pickTracks(count: number, offset = 0): MusicGridItem[] {
  return CATALOG_TRACKS.slice(offset, offset + count).map(trackToGridItem);
}

export const GOOD_EVENING_SHORTCUTS: ShortcutItem[] = [
  shortcutFromAlbum("shortcut-am", "am"),
  shortcutFromAlbum("shortcut-currents", "currents"),
  shortcutFromAlbum("shortcut-after-hours", "after-hours"),
  {
    id: "shortcut-daily-1",
    label: "Daily Mix 1",
    imageUrl: "/images/playlists/daily-mix-1.jpg",
    spotifyUrl: fictionalPlaylistLink("Daily Mix 1"),
  },
  shortcutFromAlbum("shortcut-midnights", "midnights"),
  shortcutFromAlbum("shortcut-igor", "igor"),
  shortcutFromAlbum("shortcut-ram", "random-access-memories"),
  shortcutFromAlbum("shortcut-blonde", "blonde"),
];

export const RECENTLY_PLAYED_ALBUMS = pickAlbums(8, 20);

export const MADE_FOR_YOU_SHELF = pickPlaylists([
  "playlist-made-for-you-1",
  "playlist-made-for-you-2",
  "playlist-made-for-you-3",
  "playlist-made-for-you-4",
  "playlist-made-for-you-5",
  "playlist-made-for-you-6",
  "playlist-made-for-you-7",
  "playlist-made-for-you-8",
]);

export const DAILY_MIXES_SHELF = pickPlaylists([
  "playlist-daily-mix-1",
  "playlist-daily-mix-2",
  "playlist-daily-mix-3",
  "playlist-daily-mix-4",
  "playlist-daily-mix-5",
  "playlist-daily-mix-6",
]);

export const DISCOVER_WEEKLY_SHELF = pickPlaylists(["playlist-discover-weekly"]);
export const RELEASE_RADAR_SHELF = pickPlaylists(["playlist-release-radar"]);

export const JUMP_BACK_IN_SHELF = pickPlaylists([
  "playlist-jump-back-1",
  "playlist-jump-back-2",
  "playlist-jump-back-3",
  "playlist-jump-back-4",
  "playlist-jump-back-5",
  "playlist-jump-back-6",
  "playlist-jump-back-7",
  "playlist-jump-back-8",
]);

export const TRENDING_NOW_SHELF = pickTracks(8, 32);
export const POPULAR_ALBUMS_SHELF = pickAlbums(8, 8);
export const NEW_RELEASES_SHELF = pickAlbums(8, 0);
export const BECAUSE_ARCTIC_MONKEYS_SHELF = pickPlaylists([
  "playlist-because-am-1",
  "playlist-because-am-2",
  "playlist-because-am-3",
  "playlist-because-am-4",
  "playlist-because-am-5",
  "playlist-because-am-6",
]);
export const BECAUSE_THE_WEEKND_SHELF = pickPlaylists([
  "playlist-because-weeknd-1",
  "playlist-because-weeknd-2",
  "playlist-because-weeknd-3",
  "playlist-because-weeknd-4",
  "playlist-because-weeknd-5",
  "playlist-because-weeknd-6",
]);
export const EDITORS_PICKS_SHELF = pickPlaylists([
  "playlist-editors-1",
  "playlist-editors-2",
  "playlist-editors-3",
  "playlist-editors-4",
  "playlist-editors-5",
  "playlist-editors-6",
  "playlist-editors-7",
  "playlist-editors-8",
]);
export const AI_PICKS_SHELF = pickPlaylists([
  "playlist-ai-pick-1",
  "playlist-ai-pick-2",
  "playlist-ai-pick-3",
  "playlist-ai-pick-4",
  "playlist-ai-pick-5",
  "playlist-ai-pick-6",
  "playlist-ai-pick-7",
  "playlist-ai-pick-8",
]);
