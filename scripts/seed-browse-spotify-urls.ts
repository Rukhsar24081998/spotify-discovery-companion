/**
 * Seeds browse catalog Spotify URLs from the Spotify Web API.
 * Writes lib/generated/browseSpotifyUrls.ts — external_urls.spotify only, no invented IDs.
 *
 * Run: npm run seed:browse-urls
 */

const fs = require("fs");
const path = require("path");

interface SpotifyImage {
  url: string;
  height?: number | null;
  width?: number | null;
}

interface SpotifyArtistObject {
  id: string;
  name: string;
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
}

interface SpotifyAlbumObject {
  id: string;
  name: string;
  artists: SpotifyArtistObject[];
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
}

interface SpotifyTrackObject {
  id: string;
  name: string;
  artists: SpotifyArtistObject[];
  album?: { images?: SpotifyImage[] };
  external_urls?: { spotify?: string };
}

interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
}

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    return;
  }
  const content: string = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET required in .env.local");
  }
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    throw new Error(`Token request failed (${response.status})`);
  }
  const json = (await response.json()) as SpotifyTokenResponse;
  return json.access_token;
}

async function spotifySearch(
  token: string,
  type: "album" | "track" | "artist",
  q: string,
): Promise<unknown> {
  const market = process.env.SPOTIFY_MARKET?.trim();
  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", q);
  url.searchParams.set("type", type);
  url.searchParams.set("limit", "5");
  if (market) {
    url.searchParams.set("market", market);
  }
  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Search failed (${response.status}) for ${type}: ${q}`);
  }
  return response.json();
}

function pickAlbum(item: SpotifyAlbumObject): string | null {
  return item.external_urls?.spotify?.trim() || null;
}

function pickTrack(item: SpotifyTrackObject): string | null {
  return item.external_urls?.spotify?.trim() || null;
}

function pickArtist(item: SpotifyArtistObject): string | null {
  return item.external_urls?.spotify?.trim() || null;
}

function pickImageUrl(images?: SpotifyImage[]): string | null {
  if (!images?.length) {
    return null;
  }
  const sorted = [...images].sort(
    (a, b) => (b.width ?? 0) - (a.width ?? 0),
  );
  return sorted[0]?.url?.trim() || null;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function findAlbum(
  items: SpotifyAlbumObject[],
  title: string,
  artist: string,
): { url: string | null; imageUrl: string | null; artistUrl: string | null } {
  const wantTitle = normalize(title);
  const wantArtist = normalize(artist);
  for (const item of items) {
    const url = pickAlbum(item);
    if (!url) continue;
    const namesMatch =
      normalize(item.name) === wantTitle ||
      normalize(item.name).includes(wantTitle) ||
      wantTitle.includes(normalize(item.name));
    const artistMatch = item.artists.some(
      (a) =>
        normalize(a.name) === wantArtist || normalize(a.name).includes(wantArtist.split(" ")[0]),
    );
    if (namesMatch && artistMatch) {
      return {
        url,
        imageUrl: pickImageUrl(item.images),
        artistUrl: pickArtist(item.artists[0] ?? {}),
      };
    }
  }
  const fallback = items[0];
  return {
    url: fallback ? pickAlbum(fallback) : null,
    imageUrl: fallback ? pickImageUrl(fallback.images) : null,
    artistUrl: fallback?.artists[0] ? pickArtist(fallback.artists[0]) : null,
  };
}

function findTrack(
  items: SpotifyTrackObject[],
  title: string,
  artist: string,
): { url: string | null; imageUrl: string | null } {
  const wantTitle = normalize(title);
  const wantArtist = normalize(artist);
  for (const item of items) {
    const url = pickTrack(item);
    if (!url) continue;
    const titleMatch =
      normalize(item.name) === wantTitle ||
      normalize(item.name).includes(wantTitle) ||
      wantTitle.includes(normalize(item.name));
    const artistMatch = item.artists.some((a) => normalize(a.name).includes(wantArtist.split(" ")[0]));
    if (titleMatch && artistMatch) {
      return {
        url,
        imageUrl: pickImageUrl(item.album?.images),
      };
    }
  }
  const fallback = items[0];
  return {
    url: fallback ? pickTrack(fallback) : null,
    imageUrl: fallback ? pickImageUrl(fallback.album?.images) : null,
  };
}

function findArtistEntry(
  items: SpotifyArtistObject[],
  name: string,
): { url: string | null; imageUrl: string | null } {
  const want = normalize(name);
  for (const item of items) {
    const url = pickArtist(item);
    if (!url) continue;
    if (normalize(item.name) === want) {
      return { url, imageUrl: pickImageUrl(item.images) };
    }
  }
  const fallback = items[0];
  return {
    url: fallback ? pickArtist(fallback) : null,
    imageUrl: fallback ? pickImageUrl(fallback.images) : null,
  };
}

async function main(): Promise<void> {
  loadEnvLocal();
  // Dynamic import of catalog metadata (no hardcoded URLs).
  const meta = await import("../lib/browseCatalogMeta.ts");
  const token = await getToken();

  const albums: Record<string, string> = {};
  const albumArtists: Record<string, string> = {};
  const tracks: Record<string, string> = {};
  const artists: Record<string, string> = {};
  const artworkAlbums: Record<string, string> = {};
  const artworkArtists: Record<string, string> = {};
  const artworkTracks: Record<string, string> = {};

  const albumById = new Map(meta.ALBUM_METADATA.map((a: { id: string }) => [a.id, a]));

  console.log(`Seeding ${meta.ALBUM_METADATA.length} albums...`);
  for (const album of meta.ALBUM_METADATA) {
    const json = (await spotifySearch(
      token,
      "album",
      `album:"${album.title}" artist:"${album.artist}"`,
    )) as { albums?: { items: SpotifyAlbumObject[] } };
    const items = json.albums?.items ?? [];
    const match = findAlbum(items, album.title, album.artist);
    if (match.url) {
      albums[album.id] = match.url;
      if (match.artistUrl) {
        albumArtists[album.id] = match.artistUrl;
      }
      if (match.imageUrl) {
        artworkAlbums[album.id] = match.imageUrl;
      }
    } else {
      console.warn(`  [album] no API URL: ${album.id}`);
    }
    await sleep(120);
  }

  console.log(`Seeding ${meta.ARTIST_METADATA.length} artists...`);
  for (const artist of meta.ARTIST_METADATA) {
    const json = (await spotifySearch(token, "artist", `artist:"${artist.name}"`)) as {
      artists?: { items: SpotifyArtistObject[] };
    };
    const items = json.artists?.items ?? [];
    const match = findArtistEntry(items, artist.name);
    if (match.url) {
      artists[artist.id] = match.url;
      if (match.imageUrl) {
        artworkArtists[artist.id] = match.imageUrl;
      }
    } else {
      console.warn(`  [artist] no API URL: ${artist.id}`);
    }
    await sleep(120);
  }

  console.log(`Seeding ${meta.TRACK_METADATA.length} tracks...`);
  for (const track of meta.TRACK_METADATA) {
    const album = albumById.get(track.albumId) as { artist: string } | undefined;
    const artist = album?.artist ?? "";
    const json = (await spotifySearch(
      token,
      "track",
      `track:"${track.title}" artist:"${artist}"`,
    )) as { tracks?: { items: SpotifyTrackObject[] } };
    const items = json.tracks?.items ?? [];
    const match = findTrack(items, track.title, artist);
    if (match.url) {
      tracks[track.id] = match.url;
      if (match.imageUrl) {
        artworkTracks[track.id] = match.imageUrl;
      }
    } else {
      console.warn(`  [track] no API URL: ${track.id}`);
    }
    await sleep(120);
  }

  const outDir = path.join(process.cwd(), "lib/generated");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "browseSpotifyUrls.ts");
  const generatedAt = new Date().toISOString();
  const contents = `/** Auto-generated by scripts/seed-browse-spotify-urls.ts — do not edit manually.
 * Generated at: ${generatedAt}
 * Source: Spotify Web API external_urls.spotify + images[].url
 */

export interface BrowseSpotifyUrls {
  albums: Record<string, string>;
  albumArtists: Record<string, string>;
  tracks: Record<string, string>;
  artists: Record<string, string>;
}

export interface BrowseSpotifyArtwork {
  albums: Record<string, string>;
  artists: Record<string, string>;
  tracks: Record<string, string>;
}

export const BROWSE_SPOTIFY_URLS: BrowseSpotifyUrls = ${JSON.stringify(
    { albums, albumArtists, tracks, artists },
    null,
    2,
  )} as BrowseSpotifyUrls;

export const BROWSE_SPOTIFY_ARTWORK: BrowseSpotifyArtwork = ${JSON.stringify(
    { albums: artworkAlbums, artists: artworkArtists, tracks: artworkTracks },
    null,
    2,
  )} as BrowseSpotifyArtwork;
`;
  fs.writeFileSync(outPath, contents);
  console.log(`Wrote ${outPath}`);
  console.log(
    `Counts: albums=${Object.keys(albums).length}, tracks=${Object.keys(tracks).length}, artists=${Object.keys(artists).length}, artwork=${Object.keys(artworkAlbums).length + Object.keys(artworkArtists).length + Object.keys(artworkTracks).length}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
