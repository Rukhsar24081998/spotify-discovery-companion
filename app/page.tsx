import { CategoryTabs } from "@/components/home/CategoryTabs";
import { DiscoveryInsights } from "@/components/home/DiscoveryInsights";
import { HeroCard } from "@/components/home/HeroCard";
import { MadeForYou } from "@/components/home/MadeForYou";
import { RecentlyPlayed } from "@/components/home/RecentlyPlayed";
import { HomeShell } from "@/components/layout/HomeShell";

/**
 * Screen 1 — Spotify Home shell with AI Discovery hero (design-reference/01-home.png).
 */
export default function HomePage() {
  return (
    <HomeShell>
      <CategoryTabs />
      <HeroCard />
      <RecentlyPlayed />
      <MadeForYou />
      <DiscoveryInsights />
    </HomeShell>
  );
}
