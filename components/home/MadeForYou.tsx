import { MusicGrid } from "@/components/home/MusicGrid";
import { MADE_FOR_YOU } from "@/lib/mockBrowseContent";

/**
 * "Made For You" section from the home mockup.
 */
export function MadeForYou() {
  return <MusicGrid heading="Made For You" items={MADE_FOR_YOU} showAll />;
}
