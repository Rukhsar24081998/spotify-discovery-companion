import { DiscoveryCard } from "@/components/DiscoveryCard";
import { Heading } from "@/components/ui/Heading";

/**
 * Screen 1 — Spotify Home. The familiar Spotify experience stays intact; we add
 * exactly one optional Discovery Companion card (ui-guidelines.md -> Screen 1).
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-content flex-col gap-10 px-6 py-12 sm:py-16">
      <header className="flex flex-col gap-1">
        <p className="text-support text-white/50">Spotify</p>
        <Heading level={1}>Good evening</Heading>
      </header>

      <section aria-labelledby="discovery-companion-heading" className="animate-fade-in">
        <h2 id="discovery-companion-heading" className="sr-only">
          Discovery Companion
        </h2>
        <DiscoveryCard />
      </section>
    </main>
  );
}
