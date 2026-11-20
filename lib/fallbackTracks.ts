/**
 * Curated fallback candidate tracks and search items.
 *
 * Provides a resilient, high-quality candidate pool with verified Spotify URLs
 * and album artwork when Spotify's search endpoint is restricted (e.g. 403 Forbidden
 * on development-mode client credentials) or fails upstream.
 */

import type {
  ArtistSuggestion,
  BrowseSearchItem,
  CandidateTrack,
  SpotifyBrowseSearchResponse,
} from "@/types";

export interface FallbackTrackRecord extends CandidateTrack {
  moods: string[];
  activities: string[];
  genre: string;
}

export const CURATED_TRACKS: FallbackTrackRecord[] = [
  // 1. The Weeknd - Blinding Lights
  {
    trackId: "0VjIjW4GlUZAMYd2vXMi3b",
    title: "Blinding Lights",
    artist: "The Weeknd",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    popularity: 92,
    moods: ["Happy", "Energetic", "Chill"],
    activities: ["Workout", "Driving", "Gaming", "Traveling"],
    genre: "Pop / Synthwave",
  },
  // 2. Daft Punk - Get Lucky
  {
    trackId: "69kOkLUCkxIZYexIgSG8rq",
    title: "Get Lucky",
    artist: "Daft Punk, Pharrell Williams, Nile Rodgers",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/69kOkLUCkxIZYexIgSG8rq",
    popularity: 85,
    moods: ["Happy", "Energetic", "Chill"],
    activities: ["Workout", "Driving", "Cooking", "Relaxing"],
    genre: "Disco / Funk",
  },
  // 3. Dua Lipa - Levitating
  {
    trackId: "39LLxExYz6ewLAcYrzQQyP",
    title: "Levitating",
    artist: "Dua Lipa",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273c88bae7846e62a8ba59ee0bd",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/39LLxExYz6ewLAcYrzQQyP",
    popularity: 88,
    moods: ["Happy", "Energetic"],
    activities: ["Workout", "Driving", "Cooking"],
    genre: "Nu-Disco / Pop",
  },
  // 4. Harry Styles - As It Was
  {
    trackId: "4Dvkj6JhhA12EX05fT7y2e",
    title: "As It Was",
    artist: "Harry Styles",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27348cc8e0b4e10105ef1a6700e",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/4Dvkj6JhhA12EX05fT7y2e",
    popularity: 91,
    moods: ["Happy", "Chill", "Nostalgic"],
    activities: ["Driving", "Traveling", "Relaxing"],
    genre: "Indie Pop",
  },
  // 5. Harry Styles - Watermelon Sugar
  {
    trackId: "6UelLqGlWMcVH1E5c4H7lY",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27325180571abce9472f61bd722",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY",
    popularity: 86,
    moods: ["Happy", "Romantic", "Chill"],
    activities: ["Traveling", "Relaxing", "Cooking"],
    genre: "Pop / Rock",
  },
  // 6. Taylor Swift - Shake It Off
  {
    trackId: "0cqRj7pUJDkTCEsJkx8snD",
    title: "Shake It Off",
    artist: "Taylor Swift",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27352b2a3824413eefe9e33817a",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/0cqRj7pUJDkTCEsJkx8snD",
    popularity: 84,
    moods: ["Happy", "Energetic"],
    activities: ["Workout", "Cooking", "Driving"],
    genre: "Pop",
  },
  // 7. Taylor Swift - Cardigan
  {
    trackId: "4R2kfaDFhslZEMJqAFNpdd",
    title: "cardigan",
    artist: "Taylor Swift",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27395f754318336a07e85ec59bc",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/4R2kfaDFhslZEMJqAFNpdd",
    popularity: 83,
    moods: ["Calm", "Melancholic", "Nostalgic"],
    activities: ["Studying", "Working", "Relaxing"],
    genre: "Indie Folk",
  },
  // 8. Taylor Swift - August
  {
    trackId: "3hUxzQpSfdDqwM3ZTFQY0K",
    title: "august",
    artist: "Taylor Swift",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27395f754318336a07e85ec59bc",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/3hUxzQpSfdDqwM3ZTFQY0K",
    popularity: 85,
    moods: ["Nostalgic", "Romantic", "Chill"],
    activities: ["Relaxing", "Traveling", "Studying"],
    genre: "Indie Pop",
  },
  // 9. Taylor Swift - Willow
  {
    trackId: "0lx2cLdOt3piJbcaXIV74f",
    title: "willow",
    artist: "Taylor Swift",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27333b8541201f1ef38941024be",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/0lx2cLdOt3piJbcaXIV74f",
    popularity: 81,
    moods: ["Calm", "Romantic", "Chill"],
    activities: ["Studying", "Working", "Relaxing"],
    genre: "Chamber Folk",
  },
  // 10. Tame Impala - Let It Happen
  {
    trackId: "2X485T9Z5Ly0xyaghN73ed",
    title: "Let It Happen",
    artist: "Tame Impala",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac782e363d79",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/2X485T9Z5Ly0xyaghN73ed",
    popularity: 84,
    moods: ["Focused", "Chill", "Energetic"],
    activities: ["Working", "Studying", "Driving", "Gaming"],
    genre: "Psychedelic Pop",
  },
  // 11. Tame Impala - The Less I Know The Better
  {
    trackId: "6K4t31amVTZDgR3sKmwUJJ",
    title: "The Less I Know The Better",
    artist: "Tame Impala",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac782e363d79",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/6K4t31amVTZDgR3sKmwUJJ",
    popularity: 89,
    moods: ["Focused", "Nostalgic", "Chill"],
    activities: ["Working", "Driving", "Gaming"],
    genre: "Psychedelic Rock",
  },
  // 12. Tame Impala - Borderline
  {
    trackId: "5hM5arv9KDbCHS0k9uqwjr",
    title: "Borderline",
    artist: "Tame Impala",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27358267bd34420a00d5cf83a49",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/5hM5arv9KDbCHS0k9uqwjr",
    popularity: 82,
    moods: ["Calm", "Chill", "Focused"],
    activities: ["Relaxing", "Working", "Traveling"],
    genre: "Psychedelic Pop",
  },
  // 13. Travis Scott - FE!N
  {
    trackId: "42VsgItocQwOQC3XWZ8JNA",
    title: "FE!N",
    artist: "Travis Scott, Playboi Carti",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27304481c826dd292e5e4983b3f",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/42VsgItocQwOQC3XWZ8JNA",
    popularity: 93,
    moods: ["Energetic"],
    activities: ["Workout", "Gaming"],
    genre: "Hip-Hop / Rage",
  },
  // 14. Travis Scott - SICKO MODE
  {
    trackId: "2xLMifQCjDGFmkHkpNLD9h",
    title: "SICKO MODE",
    artist: "Travis Scott",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273daec894c14c0ca42d76eeb32",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/2xLMifQCjDGFmkHkpNLD9h",
    popularity: 89,
    moods: ["Energetic"],
    activities: ["Workout", "Gaming", "Driving"],
    genre: "Trap / Hip-Hop",
  },
  // 15. Kendrick Lamar - HUMBLE.
  {
    trackId: "7KXjTSCq5nL1LoYtL7XAwS",
    title: "HUMBLE.",
    artist: "Kendrick Lamar",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273cdb645498cd3d8a2db4d05e1",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/7KXjTSCq5nL1LoYtL7XAwS",
    popularity: 90,
    moods: ["Energetic", "Focused"],
    activities: ["Workout", "Gaming"],
    genre: "Conscious Hip-Hop",
  },
  // 16. Kanye West - POWER
  {
    trackId: "2gZUPNdnz5Y45eiGxpHGSc",
    title: "POWER",
    artist: "Kanye West",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/2gZUPNdnz5Y45eiGxpHGSc",
    popularity: 86,
    moods: ["Energetic"],
    activities: ["Workout", "Gaming"],
    genre: "Hip-Hop",
  },
  // 17. Arctic Monkeys - Do I Wanna Know?
  {
    trackId: "5FVd6KXrgO9B3JPmC8OPst",
    title: "Do I Wanna Know?",
    artist: "Arctic Monkeys",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/5FVd6KXrgO9B3JPmC8OPst",
    popularity: 90,
    moods: ["Energetic", "Nostalgic", "Focused"],
    activities: ["Workout", "Driving", "Gaming"],
    genre: "Indie Rock",
  },
  // 18. Arctic Monkeys - 505
  {
    trackId: "0BxE4FqsDD1Ot4YuBXwAPp",
    title: "505",
    artist: "Arctic Monkeys",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273b1f8da74f225fa1225cdface",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/0BxE4FqsDD1Ot4YuBXwAPp",
    popularity: 88,
    moods: ["Melancholic", "Nostalgic", "Romantic"],
    activities: ["Relaxing", "Driving", "Studying"],
    genre: "Indie Rock",
  },
  // 19. Arctic Monkeys - There'd Better Be A Mirrorball
  {
    trackId: "1zx6GSqLYI2ynzAHnPRKBR",
    title: "There'd Better Be A Mirrorball",
    artist: "Arctic Monkeys",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27307823ee6237208c835802663",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/1zx6GSqLYI2ynzAHnPRKBR",
    popularity: 76,
    moods: ["Calm", "Chill", "Romantic", "Melancholic"],
    activities: ["Relaxing", "Studying", "Working"],
    genre: "Baroque Pop / Lounge",
  },
  // 20. Frank Ocean - Nights
  {
    trackId: "7eqoqGkKwgOaWNNHx90uEZ",
    title: "Nights",
    artist: "Frank Ocean",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/7eqoqGkKwgOaWNNHx90uEZ",
    popularity: 85,
    moods: ["Chill", "Focused", "Nostalgic", "Melancholic"],
    activities: ["Relaxing", "Driving", "Working", "Traveling"],
    genre: "R&B / Neo-Soul",
  },
  // 21. Frank Ocean - Thinkin Bout You
  {
    trackId: "7DfFc7a6Rwfi3YQMRbDMau",
    title: "Thinkin Bout You",
    artist: "Frank Ocean",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/7DfFc7a6Rwfi3YQMRbDMau",
    popularity: 84,
    moods: ["Romantic", "Calm", "Chill"],
    activities: ["Relaxing", "Studying", "Cooking"],
    genre: "R&B",
  },
  // 22. SZA - Snooze
  {
    trackId: "4iZ4pt7kvcaH6Yo8UoZ4s2",
    title: "Snooze",
    artist: "SZA",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273bb307f61871feef2c5daaaa8",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/4iZ4pt7kvcaH6Yo8UoZ4s2",
    popularity: 89,
    moods: ["Romantic", "Calm", "Chill"],
    activities: ["Relaxing", "Studying", "Driving"],
    genre: "Contemporary R&B",
  },
  // 23. SZA - Kill Bill
  {
    trackId: "3OHfY25tqY28d16oZczHc8",
    title: "Kill Bill",
    artist: "SZA",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273bb307f61871feef2c5daaaa8",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/3OHfY25tqY28d16oZczHc8",
    popularity: 91,
    moods: ["Melancholic", "Energetic", "Chill"],
    activities: ["Driving", "Traveling", "Cooking"],
    genre: "R&B / Pop",
  },
  // 24. Lorde - Liability
  {
    trackId: "6Kkt27YmFyIFrcX3QXFi2o",
    title: "Liability",
    artist: "Lorde",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273f8553e18a11209d4becd0336",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/6Kkt27YmFyIFrcX3QXFi2o",
    popularity: 79,
    moods: ["Melancholic", "Calm"],
    activities: ["Relaxing", "Studying"],
    genre: "Indie Pop",
  },
  // 25. Lorde - Green Light
  {
    trackId: "6ie2Bw3xLj2JcGowOlcMhb",
    title: "Green Light",
    artist: "Lorde",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273f8553e18a11209d4becd0336",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/6ie2Bw3xLj2JcGowOlcMhb",
    popularity: 77,
    moods: ["Happy", "Energetic"],
    activities: ["Workout", "Driving", "Traveling"],
    genre: "Electro-Pop",
  },
  // 26. Lana Del Rey - Summertime Sadness
  {
    trackId: "3BJe4B8zGnqEdQPMvfVjuS",
    title: "Summertime Sadness",
    artist: "Lana Del Rey",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273aaa285930cd1623de3eb60c5",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/3BJe4B8zGnqEdQPMvfVjuS",
    popularity: 87,
    moods: ["Melancholic", "Nostalgic", "Romantic"],
    activities: ["Driving", "Relaxing", "Traveling"],
    genre: "Dream Pop",
  },
  // 27. Lana Del Rey - Video Games
  {
    trackId: "0fBSs3fRoh1yJcne77fdu9",
    title: "Video Games",
    artist: "Lana Del Rey",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273aaa285930cd1623de3eb60c5",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/0fBSs3fRoh1yJcne77fdu9",
    popularity: 83,
    moods: ["Melancholic", "Romantic", "Nostalgic", "Calm"],
    activities: ["Relaxing", "Studying"],
    genre: "Baroque Pop",
  },
  // 28. Fleetwood Mac - Dreams
  {
    trackId: "0ofHAoxe9vBkTCp2UQIavz",
    title: "Dreams",
    artist: "Fleetwood Mac",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27357df7ce0eac715cf70e519a7",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/0ofHAoxe9vBkTCp2UQIavz",
    popularity: 88,
    moods: ["Chill", "Calm", "Nostalgic"],
    activities: ["Driving", "Relaxing", "Cooking", "Traveling"],
    genre: "Classic Rock",
  },
  // 29. The Beatles - Come Together
  {
    trackId: "2EqlS6tkEnglzr7tkKAAYD",
    title: "Come Together",
    artist: "The Beatles",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/2EqlS6tkEnglzr7tkKAAYD",
    popularity: 82,
    moods: ["Nostalgic", "Focused", "Chill"],
    activities: ["Working", "Driving", "Relaxing"],
    genre: "Rock",
  },
  // 30. Pink Floyd - Time
  {
    trackId: "3TO7bbrUKrOSPGRTB5MeCz",
    title: "Time",
    artist: "Pink Floyd",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273db216ca805faf5fe35df4ee6",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/3TO7bbrUKrOSPGRTB5MeCz",
    popularity: 78,
    moods: ["Focused", "Nostalgic", "Calm"],
    activities: ["Working", "Studying", "Relaxing"],
    genre: "Progressive Rock",
  },
  // 31. Daft Punk - Instant Crush
  {
    trackId: "2cGxRwrMyEAp8dEbuZaVv6",
    title: "Instant Crush",
    artist: "Daft Punk, Julian Casablancas",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/2cGxRwrMyEAp8dEbuZaVv6",
    popularity: 82,
    moods: ["Focused", "Chill", "Romantic", "Nostalgic"],
    activities: ["Working", "Driving", "Gaming"],
    genre: "Synthpop",
  },
  // 32. Tyler, The Creator - EARFQUAKE
  {
    trackId: "5hVghJ4KaYES3BFUATCYn0",
    title: "EARFQUAKE",
    artist: "Tyler, The Creator",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27330a635de2bb0caa4e26f6abb",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/5hVghJ4KaYES3BFUATCYn0",
    popularity: 86,
    moods: ["Chill", "Happy", "Romantic"],
    activities: ["Relaxing", "Driving", "Gaming"],
    genre: "Neo-Soul / Hip-Hop",
  },
  // 33. The Strokes - Someday
  {
    trackId: "56NkIxSZZiMpFP5ZNSxtnT",
    title: "Someday",
    artist: "The Strokes",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273a388a3f20d1bf2123249cc79",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/56NkIxSZZiMpFP5ZNSxtnT",
    popularity: 81,
    moods: ["Nostalgic", "Chill", "Energetic"],
    activities: ["Driving", "Traveling", "Gaming"],
    genre: "Garage Rock",
  },
  // 34. Michael Jackson - Billie Jean
  {
    trackId: "7J1uxwnxfQLu4APicE5Rnj",
    title: "Billie Jean",
    artist: "Michael Jackson",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27332a7d87248d1b75463483df5",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/7J1uxwnxfQLu4APicE5Rnj",
    popularity: 87,
    moods: ["Nostalgic", "Energetic", "Happy"],
    activities: ["Workout", "Driving", "Cooking"],
    genre: "Pop / R&B",
  },
  // 35. Amy Winehouse - Rehab
  {
    trackId: "1L5tZi0izXsi5Kk5OJf4W0",
    title: "Rehab",
    artist: "Amy Winehouse",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27376ffb5b5ab045d22c81235c1",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/1L5tZi0izXsi5Kk5OJf4W0",
    popularity: 80,
    moods: ["Nostalgic", "Melancholic", "Energetic"],
    activities: ["Cooking", "Driving", "Traveling"],
    genre: "Soul / R&B",
  },
];

/** Return candidate tracks matching requested mood and activity, padded to target limit. */
export function getFallbackTracks(
  mood?: string,
  activity?: string,
  limit = 20,
): CandidateTrack[] {
  const normMood = mood?.toLowerCase().trim();
  const normActivity = activity?.toLowerCase().trim();

  // Score tracks by relevance to mood and activity
  const scored = CURATED_TRACKS.map((t) => {
    let matchScore = 0;
    if (normMood && t.moods.some((m) => m.toLowerCase() === normMood)) {
      matchScore += 2;
    }
    if (normActivity && t.activities.some((a) => a.toLowerCase() === normActivity)) {
      matchScore += 2;
    }
    matchScore += t.popularity / 100;
    return { track: t, matchScore };
  });

  // Sort descending by match score
  scored.sort((a, b) => b.matchScore - a.matchScore);

  return scored.slice(0, limit).map(({ track }) => ({
    trackId: track.trackId,
    title: track.title,
    artist: track.artist,
    albumArt: track.albumArt,
    previewUrl: track.previewUrl,
    spotifyUrl: track.spotifyUrl,
    popularity: track.popularity,
  }));
}

/** Return candidate tracks matching a text search query. */
export function getFallbackTracksByQuery(
  query: string,
  limit = 20,
): CandidateTrack[] {
  const q = query.toLowerCase().trim();
  if (!q) {
    return getFallbackTracks(undefined, undefined, limit);
  }

  const terms = q.split(/\s+/).filter(Boolean);

  const matched = CURATED_TRACKS.filter((t) => {
    const haystack = `${t.title} ${t.artist} ${t.genre} ${t.moods.join(" ")} ${t.activities.join(" ")}`.toLowerCase();
    return terms.some((term) => haystack.includes(term));
  });

  const pool = matched.length >= 5 ? matched : CURATED_TRACKS;
  return pool.slice(0, limit).map((track) => ({
    trackId: track.trackId,
    title: track.title,
    artist: track.artist,
    albumArt: track.albumArt,
    previewUrl: track.previewUrl,
    spotifyUrl: track.spotifyUrl,
    popularity: track.popularity,
  }));
}

/** Artist suggestions for search autocomplete fallback. */
export function getFallbackArtists(
  query: string,
  limit = 5,
): ArtistSuggestion[] {
  const q = query.toLowerCase().trim();
  const seen = new Set<string>();
  const results: ArtistSuggestion[] = [];

  for (const t of CURATED_TRACKS) {
    const primaryArtist = t.artist.split(",")[0]?.trim();
    if (!primaryArtist || seen.has(primaryArtist.toLowerCase())) {
      continue;
    }
    if (!q || primaryArtist.toLowerCase().includes(q)) {
      seen.add(primaryArtist.toLowerCase());
      results.push({
        id: `artist-${primaryArtist.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        name: primaryArtist,
        image: t.albumArt,
      });
      if (results.length >= limit) {
        break;
      }
    }
  }

  return results;
}

/** Fallback browse multi-type search response. */
export function getFallbackBrowse(
  query: string,
  limit = 5,
): SpotifyBrowseSearchResponse {
  const q = query.toLowerCase().trim();
  const tracks: BrowseSearchItem[] = [];
  const artists: BrowseSearchItem[] = [];
  const albums: BrowseSearchItem[] = [];
  const seenArtists = new Set<string>();

  for (const t of CURATED_TRACKS) {
    const match =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q);

    if (match && tracks.length < limit) {
      tracks.push({
        id: t.trackId,
        type: "track",
        title: t.title,
        subtitle: t.artist,
        imageUrl: t.albumArt,
        spotifyUrl: t.spotifyUrl,
      });
    }

    const primary = t.artist.split(",")[0]?.trim();
    if (
      primary &&
      !seenArtists.has(primary.toLowerCase()) &&
      (!q || primary.toLowerCase().includes(q)) &&
      artists.length < limit
    ) {
      seenArtists.add(primary.toLowerCase());
      artists.push({
        id: `artist-${primary.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        type: "artist",
        title: primary,
        subtitle: "Artist",
        imageUrl: t.albumArt,
        spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(primary)}`,
      });
    }
  }

  const topResult = tracks[0] ?? artists[0] ?? null;

  return {
    topResult,
    tracks,
    artists,
    albums,
    playlists: [],
  };
}
