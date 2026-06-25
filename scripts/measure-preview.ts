/**
 * Dev-only utility: measures Spotify `preview_url` availability.
 *
 * This is NOT part of the production application. It exists to document an
 * important technical assumption — how many Spotify Search results actually
 * carry a usable 30-second preview — which directly affects the preview feature.
 *
 * Run with:  npm run measure:preview   (uses Node's native TypeScript support)
 *
 * It reads credentials from .env.local, never prints secrets, and is excluded
 * from the app's TypeScript build (see tsconfig "exclude").
 */

const fs = require("fs");
const path = require("path");

interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
}

interface SpotifyTrackItem {
  name: string;
  preview_url: string | null;
  artists: { name: string }[];
}

interface SpotifyTrackSearchResponse {
  tracks?: { items: SpotifyTrackItem[] };
}

const QUERIES = [
  "high energy workout hindi english",
  "lofi study beats",
  "energetic pop motivational",
  "calm acoustic evening",
  "driving classic rock",
];

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
    const rawValue = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = rawValue;
    }
  }
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET in .env.local");
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

// Spotify development-mode quota caps `limit` at 10, so we page with `offset`.
const PAGE_SIZE = 10;
const TARGET_PER_QUERY = 20;

async function searchTracksPage(
  token: string,
  query: string,
  market: string | undefined,
  limit: number,
  offset: number,
): Promise<SpotifyTrackItem[]> {
  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "track");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  if (market) {
    url.searchParams.set("market", market);
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Search failed for "${query}" (${response.status})`);
  }
  const json = (await response.json()) as SpotifyTrackSearchResponse;
  return json.tracks?.items ?? [];
}

async function searchTracks(
  token: string,
  query: string,
  market: string | undefined,
): Promise<SpotifyTrackItem[]> {
  const items: SpotifyTrackItem[] = [];
  for (let offset = 0; offset < TARGET_PER_QUERY; offset += PAGE_SIZE) {
    const pageLimit = Math.min(PAGE_SIZE, TARGET_PER_QUERY - offset);
    const page = await searchTracksPage(token, query, market, pageLimit, offset);
    items.push(...page);
    if (page.length < pageLimit) {
      break;
    }
  }
  return items;
}

async function main(): Promise<void> {
  loadEnvLocal();
  const marketEnv = process.env.SPOTIFY_MARKET;
  const market = marketEnv && marketEnv.trim() ? marketEnv.trim() : undefined;

  const token = await getAccessToken();
  console.log(`[measure-preview] Market: ${market ?? "(none / Spotify default)"}`);

  let totalTracks = 0;
  let totalWithPreview = 0;

  for (const query of QUERIES) {
    const items = await searchTracks(token, query, market);
    const withPreview = items.filter((item) => item.preview_url !== null).length;
    totalTracks += items.length;
    totalWithPreview += withPreview;
    console.log(
      `[measure-preview] "${query}": ${withPreview} / ${items.length} with preview_url`,
    );
  }

  const pct = totalTracks > 0 ? ((totalWithPreview / totalTracks) * 100).toFixed(1) : "0.0";
  console.log(
    `[measure-preview] Preview availability: ${totalWithPreview} / ${totalTracks} tracks (${pct}%)`,
  );
}

main().catch((error) => {
  console.error(
    "[measure-preview] Error:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
