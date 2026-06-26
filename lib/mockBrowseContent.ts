/** Curated static browse content — artwork from Spotify CDN (display only). */

export const SPOTIFY_WEB_URL = "https://open.spotify.com";

/** Tooltip copy for unavailable UI controls. */
export const COMING_SOON_TITLE = "Coming Soon";

export interface RecentlyPlayedItem {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  albumSpotifyUrl: string;
  trackSpotifyUrl: string;
  artistSpotifyUrl: string;
}

export interface PlaylistGridItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  spotifyUrl: string;
}

export const RECENTLY_PLAYED: RecentlyPlayedItem[] = [
  {
    id: "arctic-monkeys",
    title: "There'd Better Be A Mirror Ball",
    artist: "Arctic Monkeys",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273a9a9dd642458b961f425f43a",
    albumSpotifyUrl: "https://open.spotify.com/album/6aWHXZYEB4D44aN5p7m7TY",
    trackSpotifyUrl: "https://open.spotify.com/track/0bxPAgFIaA6AORRcnQAo2B",
    artistSpotifyUrl: "https://open.spotify.com/artist/7LnBartcCS0KyzYTSqPW1z",
  },
  {
    id: "sza",
    title: "Kill Bill",
    artist: "SZA",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273472345d2c49609e58a68cb67",
    albumSpotifyUrl: "https://open.spotify.com/album/7kGUGd4bH0aEan6X0aTNDT",
    trackSpotifyUrl: "https://open.spotify.com/track/3koAf8faKRWeYMY8eOprDs",
    artistSpotifyUrl: "https://open.spotify.com/artist/4tZwfgrHOc4mvBSaReKMtI",
  },
  {
    id: "taylor-swift",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd841e0b2457b64",
    albumSpotifyUrl: "https://open.spotify.com/album/3lS8HiHfQzMgRfWoYiiWDQ",
    trackSpotifyUrl: "https://open.spotify.com/track/0V3wPSX9gBnXRH8aiw9rKT",
    artistSpotifyUrl: "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02",
  },
  {
    id: "the-weeknd",
    title: "Take My Breath",
    artist: "The Weeknd",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc011a1d64a6b586028b",
    albumSpotifyUrl: "https://open.spotify.com/album/4yP0GrkcTNSZK1UBnotIqG",
    trackSpotifyUrl: "https://open.spotify.com/track/64mR2as9XSUoG9H8O4YqKT",
    artistSpotifyUrl: "https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ",
  },
];

export const MADE_FOR_YOU: PlaylistGridItem[] = [
  {
    id: "discover-weekly",
    title: "Discover Weekly",
    subtitle: "Your weekly mixtape of fresh music",
    imageUrl: "https://i.scdn.co/image/ab67706f00000002ca5a7517154680eb16916993",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZEVXcJZyENOWUFo7",
  },
  {
    id: "release-radar",
    title: "Release Radar",
    subtitle: "Catch all the latest music from artists you follow",
    imageUrl: "https://i.scdn.co/image/ab67706f0000000292495013656be0532a0e23a4",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZEVXcKMsF84U3Km2",
  },
  {
    id: "daily-mix-1",
    title: "Daily Mix 1",
    subtitle: "Arctic Monkeys, The Strokes and more",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273a9a9dd642458b961f425f43a",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
  },
  {
    id: "daily-mix-2",
    title: "Daily Mix 2",
    subtitle: "Daft Punk, Justice and more",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b2734718ecc2e9d8759595a0ef7e",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4dyzvuaRJ0n",
  },
];

export const NOW_PLAYING = {
  title: "Blinding Lights",
  artist: "The Weeknd",
  imageUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc011a1d64a6b586028b",
  trackSpotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
  artistSpotifyUrl: "https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ",
};

export const DISCOVERY_INSIGHTS = {
  headerImageUrl: "https://i.scdn.co/image/ab67616d0000b2734718ecc2e9d8759595a0ef7e",
  mix: {
    title: "Rhythmic Flow Mix",
    subtitle: "Recommended for your current mood",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc011a1d64a6b586028b",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4dyzvuaRJ0n",
  },
};

const spotifyLinkClass =
  "rounded-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

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
