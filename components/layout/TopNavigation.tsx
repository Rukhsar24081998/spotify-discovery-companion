"use client";

import { SPOTIFY_PREMIUM_URL } from "@/lib/mockBrowseContent";
import { NotificationsPopover } from "@/components/layout/NotificationsPopover";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { SpotifySearch } from "@/components/layout/SpotifySearch";

/**
 * Spotify-inspired top bar with interactive search.
 */
export function TopNavigation() {
  function handleUpgradeClick() {
    window.open(SPOTIFY_PREMIUM_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <header className="flex min-w-0 shrink-0 items-center gap-3 px-4 py-3 md:gap-5 md:px-5 md:py-4 xl:gap-6 xl:px-6 xl:py-5">
      <SpotifySearch />

      <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-2">
        <button
          type="button"
          onClick={handleUpgradeClick}
          aria-label="Upgrade to Spotify Premium"
          className="hidden rounded-full border border-white/15 px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-white/90 transition-colors duration-150 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:inline-flex"
        >
          Upgrade
        </button>
        <NotificationsPopover />
        <ProfileMenu />
      </div>
    </header>
  );
}
