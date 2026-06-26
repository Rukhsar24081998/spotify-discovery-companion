import { Bell, Search, User } from "lucide-react";

const TOP_TABS = ["Music", "Podcasts", "Audiobooks"] as const;

/**
 * Spotify-inspired top bar with search and account controls.
 */
export function TopNavigation() {
  return (
    <header className="flex shrink-0 items-center gap-6 px-6 py-5">
      <div className="relative mx-auto w-full max-w-[480px] flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/45"
          aria-hidden="true"
        />
        <input
          type="search"
          readOnly
          placeholder="Search Artists, Songs, Moods"
          aria-label="Search Artists, Songs, Moods"
          className="h-12 w-full rounded-full bg-[#282828] pl-12 pr-5 text-sm text-white placeholder:text-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>

      <nav aria-label="Content type" className="hidden shrink-0 items-center gap-7 lg:flex">
        {TOP_TABS.map((tab, index) => (
          <span
            key={tab}
            className={
              index === 0
                ? "border-b-2 border-accent pb-0.5 text-sm font-semibold text-white"
                : "text-sm text-white/45 hover:text-white"
            }
          >
            {tab}
          </span>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="hidden rounded-full border border-white/25 px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-white sm:inline-flex"
        >
          Upgrade
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label="Notifications"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/65 hover:text-white"
        >
          <Bell className="h-[22px] w-[22px]" aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label="Profile"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#282828] text-white/65"
        >
          <User className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
