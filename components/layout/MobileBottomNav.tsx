"use client";

import Link from "next/link";
import { Home, Sparkles } from "lucide-react";

interface MobileBottomNavProps {
  activeItem?: "home" | "discover";
}

const NAV_ITEMS = [
  { id: "home" as const, label: "Home", href: "/", icon: Home },
  { id: "discover" as const, label: "AI Discovery", href: "/discover", icon: Sparkles },
] as const;

/**
 * Mobile bottom navigation — visible below the xl desktop breakpoint.
 */
export function MobileBottomNav({ activeItem = "home" }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-stretch border-t border-[#282828] bg-[#181818] pb-[env(safe-area-inset-bottom,0px)] md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
              isActive ? "text-accent" : "text-white/55 hover:text-white"
            }`}
          >
            <Icon
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
              strokeWidth={isActive ? 2.25 : 2}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
