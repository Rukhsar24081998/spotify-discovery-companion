import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CardShell } from "@/components/ui/CardShell";
import { Heading } from "@/components/ui/Heading";

/**
 * The single promoted card added to Spotify Home (Screen 1). It should feel
 * like a native, promoted Spotify feature rather than an advertisement
 * (ui-guidelines.md -> Screen 1, implementation-plan.md -> Step 1).
 */
export function DiscoveryCard() {
  return (
    <CardShell
      interactive
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-2 text-support font-semibold text-accent">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Discovery Companion
        </span>
        <Heading level={3}>Feeling stuck in a loop?</Heading>
        <p className="text-support text-white/60">Discover something new</p>
      </div>

      <Link
        href="/discover"
        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-support font-semibold text-black transition-colors duration-150 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Discover
      </Link>
    </CardShell>
  );
}
