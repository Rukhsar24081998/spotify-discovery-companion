import { MusicGrid } from "@/components/home/MusicGrid";
import {
  AI_PICKS_SHELF,
  BECAUSE_ARCTIC_MONKEYS_SHELF,
  BECAUSE_THE_WEEKND_SHELF,
  DAILY_MIXES_SHELF,
  DISCOVER_WEEKLY_SHELF,
  EDITORS_PICKS_SHELF,
  JUMP_BACK_IN_SHELF,
  MADE_FOR_YOU_SHELF,
  NEW_RELEASES_SHELF,
  POPULAR_ALBUMS_SHELF,
  RELEASE_RADAR_SHELF,
  TRENDING_NOW_SHELF,
} from "@/lib/browseSections";

export function MadeForYouSection() {
  return <MusicGrid heading="Made For You" items={MADE_FOR_YOU_SHELF} showAll />;
}

export function DailyMixesSection() {
  return <MusicGrid heading="Daily Mixes" items={DAILY_MIXES_SHELF} showAll />;
}

export function DiscoverWeeklySection() {
  return <MusicGrid heading="Discover Weekly" items={DISCOVER_WEEKLY_SHELF} />;
}

export function ReleaseRadarSection() {
  return <MusicGrid heading="Release Radar" items={RELEASE_RADAR_SHELF} />;
}

export function JumpBackInSection() {
  return <MusicGrid heading="Jump Back In" items={JUMP_BACK_IN_SHELF} showAll />;
}

export function TrendingNowSection() {
  return <MusicGrid heading="Trending Now" items={TRENDING_NOW_SHELF} showAll />;
}

export function PopularAlbumsSection() {
  return <MusicGrid heading="Popular Albums" items={POPULAR_ALBUMS_SHELF} showAll />;
}

export function NewReleasesSection() {
  return <MusicGrid heading="New Releases" items={NEW_RELEASES_SHELF} showAll />;
}

export function BecauseArcticMonkeysSection() {
  return (
    <MusicGrid
      heading="Because You Like Arctic Monkeys"
      items={BECAUSE_ARCTIC_MONKEYS_SHELF}
      showAll
    />
  );
}

export function BecauseTheWeekndSection() {
  return (
    <MusicGrid
      heading="Because You Like The Weeknd"
      items={BECAUSE_THE_WEEKND_SHELF}
      showAll
    />
  );
}

export function EditorsPicksSection() {
  return <MusicGrid heading="Editor's Picks" items={EDITORS_PICKS_SHELF} showAll />;
}

export function AiPicksForYouSection() {
  return <MusicGrid heading="AI Picks For You" items={AI_PICKS_SHELF} showAll />;
}
