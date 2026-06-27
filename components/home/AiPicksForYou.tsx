import { MusicGrid } from "@/components/home/MusicGrid";
import { MADE_FOR_YOU } from "@/lib/mockBrowseContent";

const AI_PICKS_ITEMS = MADE_FOR_YOU.map((item) => ({ ...item, id: `ai-${item.id}` }));

/**
 * AI-curated picks section — reuses DISCOVERY_INSIGHTS mix + MADE_FOR_YOU mock data.
 */
export function AiPicksForYou() {
  return <MusicGrid heading="AI Picks For You" items={AI_PICKS_ITEMS} />;
}
