"use client";

import { useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { COMING_SOON_TITLE } from "@/lib/mockBrowseContent";

const TOP_TABS = ["Music", "Podcasts", "Audiobooks"] as const;

/**
 * Spotify-inspired top bar with interactive search and content-type tabs.
 */
export function TopNavigation() {
  const [query, setQuery] = useState("");

  return (
    <header className="flex shrink-0 items-center gap-6 px-6 py-5">
      <div className="relative mx-auto w-full max-w-[480px] flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/45"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Artists, Songs, Moods"
          aria-label="Search Artists, Songs, Moods"
          className="h-12 w-full cursor-text rounded-full bg-[#282828] pl-12 pr-5 text-sm text-white placeholder:text-white/45 transition-colors duration-150 hover:bg-[#333333] focus-visible:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>

      <nav aria-label="Content type" className="hidden shrink-0 items-center gap-7 lg:flex">
        {TOP_TABS.map((tab, index) => (
          <button
            key={tab}
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TITLE}
            className={`cursor-not-allowed border-b-2 pb-0.5 text-sm transition-colors duration-150 ${
              index === 0
                ? "border-accent/40 font-semibold text-white/45"
                : "border-transparent text-white/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
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
