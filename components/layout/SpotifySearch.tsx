"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Search } from "lucide-react";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import {
  CATALOG_ALBUMS,
  CATALOG_ARTISTS,
  CATALOG_PLAYLISTS,
  CATALOG_TRACKS,
} from "@/lib/mockBrowseCatalog";
import { ARTWORK_PLACEHOLDER_SRC } from "@/lib/mockBrowseContent";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;
const MAX_PER_GROUP = 5;

type ResultKind = "track" | "artist" | "album" | "playlist";

interface CatalogEntry {
  id: string;
  kind: ResultKind;
  label: string;
  detail: string;
  imageUrl: string;
  spotifyUrl: string;
}

interface GroupedResults {
  tracks: CatalogEntry[];
  artists: CatalogEntry[];
  albums: CatalogEntry[];
  playlists: CatalogEntry[];
}

const albumById = new Map(CATALOG_ALBUMS.map((album) => [album.id, album]));

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function buildCatalog(): CatalogEntry[] {
  const tracks: CatalogEntry[] = CATALOG_TRACKS.map((track) => {
    const album = albumById.get(track.albumId);
    return {
      id: `track-${track.id}`,
      kind: "track" as const,
      label: track.title,
      detail: album?.artist ?? "",
      imageUrl: album?.imageUrl ?? ARTWORK_PLACEHOLDER_SRC,
      spotifyUrl: track.trackSpotifyUrl,
    };
  });

  const artists: CatalogEntry[] = CATALOG_ARTISTS.map((artist) => ({
    id: `artist-${artist.id}`,
    kind: "artist",
    label: artist.name,
    detail: "Artist",
    imageUrl: artist.imageUrl,
    spotifyUrl: artist.artistSpotifyUrl,
  }));

  const albums: CatalogEntry[] = CATALOG_ALBUMS.map((album) => ({
    id: `album-${album.id}`,
    kind: "album",
    label: album.title,
    detail: album.artist,
    imageUrl: album.imageUrl,
    spotifyUrl: album.albumSpotifyUrl,
  }));

  const playlists: CatalogEntry[] = CATALOG_PLAYLISTS.map((playlist) => ({
    id: `playlist-${playlist.id}`,
    kind: "playlist",
    label: playlist.title,
    detail: playlist.subtitle,
    imageUrl: playlist.imageUrl,
    spotifyUrl: playlist.spotifyUrl,
  }));

  return [...tracks, ...artists, ...albums, ...playlists];
}

const SEARCH_CATALOG = buildCatalog();

function matchesEntry(entry: CatalogEntry, needle: string): boolean {
  return (
    normalize(entry.label).includes(needle) ||
    normalize(entry.detail).includes(needle)
  );
}

function queryCatalog(rawQuery: string): GroupedResults {
  const needle = normalize(rawQuery);
  if (needle.length < MIN_QUERY_LENGTH) {
    return { tracks: [], artists: [], albums: [], playlists: [] };
  }

  const tracks = SEARCH_CATALOG.filter(
    (entry) => entry.kind === "track" && matchesEntry(entry, needle),
  ).slice(0, MAX_PER_GROUP);

  const artists = SEARCH_CATALOG.filter(
    (entry) => entry.kind === "artist" && matchesEntry(entry, needle),
  ).slice(0, MAX_PER_GROUP);

  const albums = SEARCH_CATALOG.filter(
    (entry) => entry.kind === "album" && matchesEntry(entry, needle),
  ).slice(0, MAX_PER_GROUP);

  const playlists = SEARCH_CATALOG.filter(
    (entry) => entry.kind === "playlist" && matchesEntry(entry, needle),
  ).slice(0, MAX_PER_GROUP);

  return { tracks, artists, albums, playlists };
}

function flattenGroups(groups: GroupedResults): CatalogEntry[] {
  return [...groups.tracks, ...groups.artists, ...groups.albums, ...groups.playlists];
}

const KIND_LABEL: Record<ResultKind, string> = {
  track: "Track",
  artist: "Artist",
  album: "Album",
  playlist: "Playlist",
};

export function SpotifySearch() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const comboboxId = useId();
  const listboxId = useId();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [query]);

  const groups = useMemo(() => queryCatalog(debouncedQuery), [debouncedQuery]);
  const flatResults = useMemo(() => flattenGroups(groups), [groups]);
  const hasResults = flatResults.length > 0;
  const showPanel =
    isOpen && debouncedQuery.trim().length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!showPanel) {
      setHighlightIndex(-1);
      return;
    }
    setHighlightIndex(flatResults.length > 0 ? 0 : -1);
  }, [debouncedQuery, showPanel, flatResults.length]);

  useEffect(() => {
    function onDocumentMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocumentMouseDown);
    return () => document.removeEventListener("mousedown", onDocumentMouseDown);
  }, []);

  function openSpotify(entry: CatalogEntry) {
    window.open(entry.spotifyUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setHighlightIndex(-1);
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      setHighlightIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (!showPanel || flatResults.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((index) => (index + 1) % flatResults.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((index) =>
        index <= 0 ? flatResults.length - 1 : index - 1,
      );
      return;
    }

    if (event.key === "Enter" && highlightIndex >= 0) {
      event.preventDefault();
      const selected = flatResults[highlightIndex];
      if (selected) {
        openSpotify(selected);
      }
    }
  }

  function renderGroup(entries: CatalogEntry[], startIndex: number) {
    return entries.map((entry, index) => {
      const rowIndex = startIndex + index;
      const isHighlighted = rowIndex === highlightIndex;
      const isArtist = entry.kind === "artist";

      return (
        <li
          key={entry.id}
          id={`${listboxId}-${entry.id}`}
          role="option"
          aria-selected={isHighlighted}
        >
          <button
            type="button"
            onMouseEnter={() => setHighlightIndex(rowIndex)}
            onClick={() => openSpotify(entry)}
            className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 ${
              isHighlighted ? "bg-[#333333]" : "hover:bg-[#333333]"
            }`}
          >
            <ArtworkImage
              src={entry.imageUrl}
              alt=""
              width={40}
              height={40}
              className={`h-10 w-10 shrink-0 object-cover ${
                isArtist ? "rounded-full" : "rounded-md"
              }`}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-white">
                {entry.label}
              </span>
              <span className="block truncate text-xs text-white/55">{entry.detail}</span>
            </span>
            <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
              {KIND_LABEL[entry.kind]}
            </span>
          </button>
        </li>
      );
    });
  }

  const artistOffset = groups.tracks.length;
  const albumOffset = artistOffset + groups.artists.length;
  const playlistOffset = albumOffset + groups.albums.length;

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-full max-w-[480px] flex-1"
    >
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/45"
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        id={comboboxId}
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={onInputKeyDown}
        placeholder="Search Artists, Songs, Moods"
        autoComplete="off"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={showPanel ? listboxId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={
          highlightIndex >= 0 && flatResults[highlightIndex]
            ? `${listboxId}-${flatResults[highlightIndex].id}`
            : undefined
        }
        aria-label="Search Artists, Songs, Moods"
        className="h-12 w-full rounded-full bg-[#282828] pl-12 pr-5 text-sm text-white placeholder:text-white/45 transition-colors duration-150 hover:bg-[#333333] focus-visible:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />

      {showPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border border-white/[0.08] bg-[#282828] shadow-[0_16px_48px_rgba(0,0,0,0.65)]">
          {!hasResults ? (
            <p className="px-4 py-5 text-sm text-white/60">
              No results for &ldquo;{debouncedQuery.trim()}&rdquo;
            </p>
          ) : (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Search results"
              className="max-h-[min(400px,55vh)] overflow-y-auto py-1"
            >
              {groups.tracks.length > 0 && (
                <>
                  <li className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-white/40">
                    Tracks
                  </li>
                  {renderGroup(groups.tracks, 0)}
                </>
              )}
              {groups.artists.length > 0 && (
                <>
                  <li className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-white/40">
                    Artists
                  </li>
                  {renderGroup(groups.artists, artistOffset)}
                </>
              )}
              {groups.albums.length > 0 && (
                <>
                  <li className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-white/40">
                    Albums
                  </li>
                  {renderGroup(groups.albums, albumOffset)}
                </>
              )}
              {groups.playlists.length > 0 && (
                <>
                  <li className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-white/40">
                    Playlists
                  </li>
                  {renderGroup(groups.playlists, playlistOffset)}
                </>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
