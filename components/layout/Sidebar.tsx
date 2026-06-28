import Link from "next/link";
import { Home, Sparkles } from "lucide-react";

interface SidebarProps {
  activeItem?: "home" | "discover";
}

const NAV_ITEMS = [
  { id: "home" as const, label: "Home", href: "/", icon: Home },
  { id: "discover" as const, label: "AI Discovery", href: "/discover", icon: Sparkles },
] as const;

function SpotifyLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/**
 * Spotify-inspired left navigation for the app shell.
 * Hidden on mobile; collapses to icons on tablet; full width on desktop (xl+).
 */
export function Sidebar({ activeItem = "home" }: SidebarProps) {
  return (
    <aside className="hidden w-[88px] shrink-0 flex-col bg-black px-3 pt-5 md:flex xl:w-[260px] xl:px-6 xl:pt-6">
      <Link
        href="/"
        className="group mb-5 inline-flex items-center justify-center gap-3 rounded-md transition-colors duration-150 motion-reduce:transition-none hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent xl:mb-7 xl:justify-start"
        aria-label="Spotify home"
      >
        <SpotifyLogo className="h-8 w-8 shrink-0 text-accent" />
        <span className="hidden text-[17px] font-bold leading-none tracking-[-0.04em] text-white xl:inline">
          Spotify
        </span>
      </Link>

      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          const linkClasses = isActive
            ? "bg-surface-hover font-semibold text-white"
            : "text-white/60 hover:bg-white/[0.06] hover:text-white";

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
              className={`inline-flex items-center justify-center gap-4 rounded-md px-3 py-2.5 text-[15px] font-medium transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent xl:justify-start ${linkClasses}`}
            >
              <Icon
                className={`h-6 w-6 shrink-0 transition-colors duration-150 ${isActive ? "text-accent" : "text-current"}`}
                aria-hidden="true"
                strokeWidth={isActive ? 2.25 : 2}
              />
              <span className="hidden xl:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
