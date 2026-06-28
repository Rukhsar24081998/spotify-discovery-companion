"use client";

import { DiscoveryFlow } from "@/components/DiscoveryFlow";
import { useAppSession } from "@/components/layout/AppSessionContext";
import { HomeShell } from "@/components/layout/HomeShell";

function DiscoverFlowWithSession() {
  const { sessionKey } = useAppSession();
  return <DiscoveryFlow key={sessionKey} />;
}

/**
 * Discover page — opens directly into the AI discovery form (no browse landing).
 */
export function DiscoverPageContent() {
  return (
    <HomeShell activeItem="discover">
      <DiscoverFlowWithSession />
    </HomeShell>
  );
}
