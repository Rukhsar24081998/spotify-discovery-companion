import Link from "next/link";
import { Home, Library, Search, Sparkles } from "lucide-react";

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
 * Spotify-inspired left navigation for the home shell.
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

          const classes = isActive
            ? "bg-surface-hover font-semibold text-accent"
            : "text-white/65 hover:bg-surface-hover hover:text-white";

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`inline-flex items-center gap-4 rounded-md px-3 py-2.5 text-sm transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${classes}`}
              >
                <Icon
                  className={`h-6 w-6 shrink-0 ${isActive ? "text-accent" : ""}`}
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
              className={`inline-flex w-full items-center gap-4 rounded-md px-3 py-2.5 text-left text-sm opacity-55 ${classes}`}
            >
              <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mx-4 my-5 border-t border-white/10" aria-hidden="true" />

      <button
        type="button"
        disabled
        aria-disabled="true"
        className="mx-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(29,185,84,0.3)] transition-shadow hover:shadow-[0_0_28px_rgba(29,185,84,0.45)]"
      >
        Create Playlist
      </button>
    </aside>
  );
}
