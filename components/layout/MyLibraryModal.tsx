"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { Library, Music2, Star, X } from "lucide-react";
import { openSpotifyUrl } from "@/components/layout/BottomPlayer";
import { useMyLibrary } from "@/components/layout/MyLibraryContext";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import { CardShell } from "@/components/ui/CardShell";
import { ARTWORK_PLACEHOLDER_SRC } from "@/lib/mockBrowseContent";
import {
  formatSavedDateLabel,
  groupSavedBySection,
  LIBRARY_SECTION_LABELS,
  type SavedRecommendation,
} from "@/lib/savedRecommendations";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function SavedLibraryCard({
  item,
  onRemove,
}: {
  item: SavedRecommendation;
  onRemove: (id: string) => void;
}) {
  return (
    <CardShell className="p-3 sm:p-3.5">
      <div className="flex gap-3 sm:gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-hover sm:h-[72px] sm:w-[72px]">
          <ArtworkImage
            src={item.artwork || ARTWORK_PLACEHOLDER_SRC}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white sm:text-base">
              ❤️ {item.title}
            </p>
            <p className="truncate text-sm text-white/60">{item.artist}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent">
              <Star className="h-3 w-3 shrink-0" aria-hidden="true" />
              {item.matchScore}% Match
            </span>
            <span className="text-[11px] font-medium text-white/45">
              {formatSavedDateLabel(item.timestampSaved)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openSpotifyUrl(item.spotifyUrl)}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#282828]"
            >
              <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
              Continue in Spotify
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="inline-flex min-h-[36px] items-center rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/40 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#282828]"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

/**
 * Spotify-style modal for saved recommendations in My Library.
 */
export function MyLibraryModal() {
  const { saved, isModalOpen, closeModal, removeSaved } = useMyLibrary();
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const sections = useMemo(() => groupSavedBySection(saved), [saved]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    closeButtonRef.current?.focus();
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    function onDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    }

    document.addEventListener("keydown", onDocumentKeyDown);
    return () => document.removeEventListener("keydown", onDocumentKeyDown);
  }, [isModalOpen, closeModal]);

  useEffect(() => {
    if (!isModalOpen || !dialogRef.current) {
      return;
    }

    const dialog = dialogRef.current;
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );

    function onDialogKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    dialog.addEventListener("keydown", onDialogKeyDown);
    return () => dialog.removeEventListener("keydown", onDialogKeyDown);
  }, [isModalOpen, saved.length, sections.length]);

  if (!isModalOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close My Library"
        onClick={closeModal}
        className="absolute inset-0 bg-black/70 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 flex max-h-[min(85vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#282828] shadow-[0_16px_48px_rgba(0,0,0,0.65)] animate-fade-in"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-bold text-white sm:text-lg">
              📚 My Library
            </h2>
            <p id={descriptionId} className="mt-1 text-sm text-white/55">
              Your saved AI discoveries.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {saved.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-10 text-center">
              <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
                <div
                  className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_30%,rgba(29,185,84,0.18),transparent_70%)]"
                  aria-hidden="true"
                />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#1a1a1a] shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                  <Library className="h-7 w-7 text-accent" aria-hidden="true" />
                </div>
              </div>
              <p className="text-base font-bold text-white">📚 My Library</p>
              <p className="mt-2 text-sm font-medium text-white/70">
                You haven&apos;t saved any discoveries yet.
              </p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
                Save recommendations while exploring
                <br />
                and they&apos;ll appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {sections.map((section) => (
                <section key={section.key} aria-label={LIBRARY_SECTION_LABELS[section.key]}>
                  <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">
                    {LIBRARY_SECTION_LABELS[section.key]}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <SavedLibraryCard item={item} onRemove={removeSaved} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
