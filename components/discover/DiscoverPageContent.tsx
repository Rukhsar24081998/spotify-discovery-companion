"use client";

import { useState } from "react";
import { CategoryTabs } from "@/components/home/CategoryTabs";
import { DiscoveryInsights } from "@/components/home/DiscoveryInsights";
import { MadeForYou } from "@/components/home/MadeForYou";
import { RecentlyPlayed } from "@/components/home/RecentlyPlayed";
import { DiscoverHero } from "@/components/discover/DiscoverHero";
import { DiscoveryFlow, type DiscoveryFlowPhase } from "@/components/DiscoveryFlow";
import { HomeShell } from "@/components/layout/HomeShell";

/**
 * Discover page layout matching design-reference/02-discovery.png.
 * The mood/activity form is visible immediately; browse sections hide during loading/results.
 */
export function DiscoverPageContent() {
  const [phase, setPhase] = useState<DiscoveryFlowPhase>("input");
  const isInputPhase = phase === "input";

  return (
    <HomeShell activeItem="discover">
      {isInputPhase && <CategoryTabs />}
      {isInputPhase && <DiscoverHero />}
      <DiscoveryFlow onPhaseChange={setPhase} />
      {isInputPhase && <RecentlyPlayed />}
      {isInputPhase && <MadeForYou />}
      {isInputPhase && <DiscoveryInsights />}
    </HomeShell>
  );
}
