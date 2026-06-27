import { HomePageContent } from "@/components/home/HomePageContent";
import { HomeShell } from "@/components/layout/HomeShell";

/**
 * Screen 1 — Spotify Home browse shell with dense mock catalog shelves.
 */
export default function HomePage() {
  return (
    <HomeShell>
      <HomePageContent />
    </HomeShell>
  );
}
