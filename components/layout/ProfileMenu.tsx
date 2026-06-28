"use client";

import { User } from "lucide-react";
import { useAppSession } from "@/components/layout/AppSessionContext";
import { MyLibraryModal } from "@/components/layout/MyLibraryModal";
import { useMyLibrary } from "@/components/layout/MyLibraryContext";
import { useMenuPanel } from "@/lib/useMenuPanel";

/**
 * Guest profile dropdown with local session reset — no auth or backend.
 */
export function ProfileMenu() {
  const { resetSession } = useAppSession();
  const { count, openModal } = useMyLibrary();
  const { isOpen, toggle, close, rootRef, triggerRef, panelRef } = useMenuPanel();

  function handleResetSession() {
    close();
    resetSession();
  }

  function handleOpenLibrary() {
    close();
    openModal();
  }

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={toggle}
          aria-label="Open profile menu"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#282828] text-white/80 transition-colors duration-150 hover:bg-[#333333] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <User className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>

        {isOpen && (
          <div
            ref={panelRef}
            role="menu"
            aria-label="Profile menu"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(280px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-white/[0.08] bg-[#282828] shadow-[0_16px_48px_rgba(0,0,0,0.65)]"
          >
            <div className="border-b border-white/[0.08] px-4 py-4">
              <p className="text-sm font-bold text-white">Guest User</p>
              <p className="mt-1 text-xs text-white/55">Spotify Discovery Companion</p>
              <p className="mt-0.5 text-xs text-white/40">Version 1.0</p>
            </div>

            <div className="h-px bg-white/[0.08]" aria-hidden="true" />

            <div className="p-1">
              <button
                type="button"
                role="menuitem"
                onClick={handleOpenLibrary}
                className="flex w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                📚 My Library ({count})
              </button>
            </div>

            <div className="h-px bg-white/[0.08]" aria-hidden="true" />

            <div className="p-1">
              <button
                type="button"
                role="menuitem"
                onClick={handleResetSession}
                className="flex w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Reset Session
              </button>
            </div>
          </div>
        )}
      </div>

      <MyLibraryModal />
    </>
  );
}
