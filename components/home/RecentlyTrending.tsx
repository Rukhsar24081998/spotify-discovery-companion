import { MusicGrid } from "@/components/home/MusicGrid";
import { RECENTLY_PLAYED } from "@/lib/mockBrowseContent";

const TRENDING_ITEMS = RECENTLY_PLAYED.map((item) => ({
  id: `trending-${item.id}`,
  title: item.title,
  subtitle: item.artist,
  artist: item.artist,
  album: item.album,
  releaseYear: item.releaseYear,
  imageUrl: item.imageUrl,
  spotifyUrl: item.trackSpotifyUrl,
}));

/**
 * Trending tracks section — reuses RECENTLY_PLAYED mock data in playlist-card layout.
 */
export function RecentlyTrending() {
  return <MusicGrid heading="Recently Trending" items={TRENDING_ITEMS} />;
}
