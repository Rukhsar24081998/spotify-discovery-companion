import { MusicGrid } from "@/components/home/MusicGrid";
import { RECENTLY_PLAYED_ALBUMS } from "@/lib/browseSections";

/**
 * "Recently Played" — album shelf with unique artwork per card.
 */
export function RecentlyPlayed() {
  return <MusicGrid heading="Recently Played" items={RECENTLY_PLAYED_ALBUMS} showAll />;
}
