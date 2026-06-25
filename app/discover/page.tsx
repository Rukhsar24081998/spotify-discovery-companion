import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

/**
 * Minimal placeholder so the Home "Discover" navigation works. The full
 * discovery input flow (mood / activity / artist search) is built in Phase 04.
 */
export default function DiscoverPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-content flex-col gap-6 px-6 py-12 sm:py-16">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-support text-white/60 transition-colors duration-150 motion-reduce:transition-none hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Home
      </Link>

      <Heading level={1}>Discovery Companion</Heading>
      <p className="text-body text-white/60">
        The discovery flow is coming in the next step.
      </p>
    </main>
  );
}
