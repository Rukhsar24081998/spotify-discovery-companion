import Link from "next/link";
import { Home, Library, Search, Sparkles } from "lucide-react";
import { COMING_SOON_TITLE } from "@/lib/mockBrowseContent";

interface SidebarProps {
  activeItem?: "home" | "discover";
}

const NAV_ITEMS = [
  { id: "home" as const, label: "Home", href: "/", icon: Home },
  { id: "search" as const, label: "Search", href: null, icon: Search },
  { id: "library" as const, label: "Your Library", href: null, icon: Library },
  { id: "discover" as const, label: "AI Discovery", href: "/discover", icon: Sparkles },
];

/**
 * Spotify-inspired left navigation for the app shell.
 */
export function Sidebar({ activeItem = "home" }: SidebarProps) {
  return (
    <aside className="flex w-[256px] shrink-0 flex-col bg-black px-2 py-5">
      <div className="mb-6 px-4">
        <p className="text-xl font-bold tracking-tight text-accent">AI Companion</p>
        <p className="mt-0.5 text-xs text-white/45">Your rhythmic curator</p>
      </div>

      <nav aria-label="Main navigation" className="flex flex-col gap-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            (item.id === "home" && activeItem === "home") ||
            (item.id === "discover" && activeItem === "discover");

          const linkClasses = isActive
            ? "border-l-2 border-accent bg-surface-hover font-semibold text-accent"
            : "border-l-2 border-transparent text-white/65 hover:bg-surface-hover hover:text-white";

          const disabledClasses =
            "cursor-not-allowed border-l-2 border-transparent text-white/35";

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex cursor-pointer items-center gap-4 rounded-md py-2.5 pl-[10px] pr-3 text-sm transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${linkClasses}`}
              >
                <Icon
                  className={`h-6 w-6 shrink-0 transition-colors duration-150 ${isActive ? "text-accent" : ""}`}
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              disabled
              aria-disabled="true"
              title={COMING_SOON_TITLE}
              className={`inline-flex w-full items-center gap-4 rounded-md py-2.5 pl-[10px] pr-3 text-left text-sm ${disabledClasses}`}
            >
              <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-white/25">
                Soon
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mx-4 my-5 border-t border-white/10" aria-hidden="true" />

      <button
        type="button"
        disabled
        aria-disabled="true"
        title={COMING_SOON_TITLE}
        className="mx-4 inline-flex min-h-[44px] cursor-not-allowed items-center justify-center rounded-full bg-accent/40 px-6 py-2.5 text-sm font-bold text-black/50 shadow-none"
      >
        Create Playlist
      </button>
    </aside>
  );
}
