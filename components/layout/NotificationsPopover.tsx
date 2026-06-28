"use client";

import { Bell } from "lucide-react";
import { useMenuPanel } from "@/lib/useMenuPanel";

/**
 * Spotify-style notifications popover — static empty state, no backend.
 */
export function NotificationsPopover() {
  const { isOpen, toggle, close, rootRef, triggerRef, panelRef } = useMenuPanel();

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Bell className="h-[22px] w-[22px]" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-white/[0.08] bg-[#282828] shadow-[0_16px_48px_rgba(0,0,0,0.65)]"
        >
          <div className="border-b border-white/[0.08] px-4 py-3">
            <h2 className="text-sm font-bold text-white">Notifications</h2>
          </div>
          <div className="px-4 py-5">
            <p className="text-sm font-medium text-white">No new notifications yet.</p>
            <p className="mt-2 text-xs leading-relaxed text-white/55">
              Future AI discoveries and updates will appear here.
            </p>
          </div>
          <div className="border-t border-white/[0.08] px-4 py-2">
            <button
              type="button"
              onClick={close}
              className="w-full rounded-md px-2 py-2 text-left text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
