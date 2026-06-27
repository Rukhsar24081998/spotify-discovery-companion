"use client";

import { useState } from "react";
import { DiscoveryInsights } from "@/components/home/DiscoveryInsights";
import { DiscoveryFlow, type DiscoveryFlowPhase } from "@/components/DiscoveryFlow";
import { HomeShell } from "@/components/layout/HomeShell";

/**
 * Discover page — opens directly into the AI discovery form (no browse landing).
 */
export function DiscoverPageContent() {
  const [phase, setPhase] = useState<DiscoveryFlowPhase>("input");

  return (
    <HomeShell activeItem="discover">
      <DiscoveryFlow onPhaseChange={setPhase} />
      {phase === "input" && <DiscoveryInsights />}
    </HomeShell>
  );
}
