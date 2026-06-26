import { MusicGrid, type MusicGridItem } from "@/components/home/MusicGrid";

const MADE_FOR_YOU: MusicGridItem[] = [
  {
    id: "discover-weekly",
    title: "Discover Weekly",
    subtitle: "Your weekly mixtape of fresh music",
    gradient: "from-emerald-700 to-teal-950",
  },
  {
    id: "release-radar",
    title: "Release Radar",
    subtitle: "Catch all the latest music from artists you follow",
    gradient: "from-blue-700 to-indigo-950",
  },
  {
    id: "daily-mix-1",
    title: "Daily Mix 1",
    subtitle: "Arctic Monkeys, The Strokes and more",
    gradient: "from-rose-800 to-red-950",
  },
  {
    id: "daily-mix-2",
    title: "Daily Mix 2",
    subtitle: "Daft Punk, Justice and more",
    gradient: "from-amber-700 to-orange-950",
  },
];

/**
 * "Made For You" section from the home mockup.
 */
export function MadeForYou() {
  return (
    <MusicGrid heading="Made For You" items={MADE_FOR_YOU} showAll />
  );
}
