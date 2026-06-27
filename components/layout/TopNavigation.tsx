import { Bell, User } from "lucide-react";
import { COMING_SOON_TITLE } from "@/lib/mockBrowseContent";
import { SpotifySearch } from "@/components/layout/SpotifySearch";

/**
 * Spotify-inspired top bar with interactive search.
 */
export function TopNavigation() {
  return (
    <header className="flex shrink-0 items-center gap-6 px-6 py-5">
      <SpotifySearch />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={COMING_SOON_TITLE}
          className="hidden cursor-not-allowed rounded-full border border-white/15 px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-white/35 sm:inline-flex"
        >
          Upgrade
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={COMING_SOON_TITLE}
          aria-label="Notifications"
          className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full text-white/35"
        >
          <Bell className="h-[22px] w-[22px]" aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={COMING_SOON_TITLE}
          aria-label="Profile"
          className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full bg-[#282828] text-white/35"
        >
          <User className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
