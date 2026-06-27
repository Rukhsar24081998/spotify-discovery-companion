/** Expanded Spotify-style browse catalog — display mock data with API-sourced Spotify links. */

import {
  ALBUM_BY_ID,
  ALBUM_METADATA,
  ARTIST_METADATA,
  PLAYLIST_METADATA,
  TRACK_METADATA,
} from "@/lib/browseCatalogMeta";
import { BROWSE_SPOTIFY_ARTWORK, BROWSE_SPOTIFY_URLS } from "@/lib/generated/browseSpotifyUrls";
import { resolveSpotifyLink, spotifySearchUrl } from "@/lib/spotifyLinks";

export interface CatalogAlbum {
  id: string;
  title: string;
  artist: string;
  releaseYear: number;
  genre: string;
  imageUrl: string;
  albumSpotifyUrl: string;
  artistSpotifyUrl: string;
}

export interface CatalogTrack {
  id: string;
  title: string;
  albumId: string;
  durationSeconds: number;
  imageUrl: string;
  trackSpotifyUrl: string;
}

export interface CatalogArtist {
  id: string;
  name: string;
  genre: string;
  imageUrl: string;
  artistSpotifyUrl: string;
}

export interface CatalogPlaylist {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  spotifyUrl: string;
  genre?: string;
}

export interface ShortcutItem {
  id: string;
  label: string;
  imageUrl: string;
  spotifyUrl: string;
}

function albumImageUrlFor(album: (typeof ALBUM_METADATA)[number]): string {
  return BROWSE_SPOTIFY_ARTWORK.albums[album.id] ?? album.imageUrl;
}

function artistImageUrlFor(artist: (typeof ARTIST_METADATA)[number]): string {
  return BROWSE_SPOTIFY_ARTWORK.artists[artist.id] ?? artist.imageUrl;
}

function trackImageUrlFor(track: (typeof TRACK_METADATA)[number]): string {
  const album = ALBUM_BY_ID.get(track.albumId);
  return (
    BROWSE_SPOTIFY_ARTWORK.tracks[track.id] ??
    (album ? albumImageUrlFor(album) : track.albumId ? "" : "")
  );
}

function albumSpotifyUrlFor(album: (typeof ALBUM_METADATA)[number]): string {
  return resolveSpotifyLink(
    BROWSE_SPOTIFY_URLS.albums[album.id],
    `${album.title} ${album.artist}`,
  );
}

function albumArtistSpotifyUrlFor(album: (typeof ALBUM_METADATA)[number]): string {
  return resolveSpotifyLink(
    BROWSE_SPOTIFY_URLS.albumArtists[album.id] ?? BROWSE_SPOTIFY_URLS.artists[album.id],
    album.artist,
  );
}

function trackSpotifyUrlFor(track: (typeof TRACK_METADATA)[number]): string {
  const album = ALBUM_BY_ID.get(track.albumId);
  const artist = album?.artist ?? "";
  return resolveSpotifyLink(
    BROWSE_SPOTIFY_URLS.tracks[track.id],
    artist ? `${track.title} ${artist}` : track.title,
  );
}

function artistSpotifyUrlFor(artist: (typeof ARTIST_METADATA)[number]): string {
  return resolveSpotifyLink(BROWSE_SPOTIFY_URLS.artists[artist.id], artist.name);
}

export const CATALOG_ALBUMS: CatalogAlbum[] = ALBUM_METADATA.map((album) => ({
  ...album,
  imageUrl: albumImageUrlFor(album),
  albumSpotifyUrl: albumSpotifyUrlFor(album),
  artistSpotifyUrl: albumArtistSpotifyUrlFor(album),
}));

export const CATALOG_TRACKS: CatalogTrack[] = TRACK_METADATA.map((track) => ({
  ...track,
  imageUrl: trackImageUrlFor(track),
  trackSpotifyUrl: trackSpotifyUrlFor(track),
}));

export const CATALOG_ARTISTS: CatalogArtist[] = ARTIST_METADATA.map((artist) => ({
  ...artist,
  imageUrl: artistImageUrlFor(artist),
  artistSpotifyUrl: artistSpotifyUrlFor(artist),
}));

export const CATALOG_PLAYLISTS: CatalogPlaylist[] = PLAYLIST_METADATA.map((playlist) => ({
  ...playlist,
  spotifyUrl: spotifySearchUrl(playlist.title),
}));

/** Resolve a catalog album shortcut by internal album id. */
export function catalogAlbumLink(albumId: string): string {
  const album = ALBUM_BY_ID.get(albumId);
  if (!album) {
    throw new Error(`Unknown album id: ${albumId}`);
  }
  return albumSpotifyUrlFor(album);
}

/** Fictional mixes always open Spotify Search — never a fabricated playlist URL. */
export function fictionalPlaylistLink(title: string): string {
  return spotifySearchUrl(title);
}
