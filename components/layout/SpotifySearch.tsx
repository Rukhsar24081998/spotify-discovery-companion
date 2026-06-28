"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { ArtworkImage } from "@/components/ui/ArtworkImage";
import { HighlightMatch } from "@/components/ui/HighlightMatch";
import {
  openSpotifyUrl,
  useNowSelected,
} from "@/components/layout/BottomPlayer";
import { setDiscoverMoodPrefill } from "@/lib/discoverMoodPrefill";
import { searchMoods, type MoodSearchEntry } from "@/lib/moodSearch";
import { ARTWORK_PLACEHOLDER_SRC } from "@/lib/mockBrowseContent";
import { fetchBrowseSearch } from "@/lib/spotifyBrowseSearchClient";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  SEARCH_TRY_SUGGESTIONS,
} from "@/lib/recentSearches";
import {
  BROWSE_SEARCH_DEBOUNCE_MS,
  MIN_BROWSE_SEARCH_LENGTH,
  type BrowseSearchItem,
  type SpotifyBrowseSearchResponse,
} from "@/types";

const MAX_PER_GROUP = 5;

type SpotifyResultKind = BrowseSearchItem["type"];
type ResultKind = SpotifyResultKind | "mood";

interface SearchResultEntry {
  id: string;
  kind: ResultKind;
  label: string;
  detail: string;
  imageUrl: string;
  spotifyUrl?: string;
  mood?: MoodSearchEntry["mood"];
  source: BrowseSearchItem | MoodSearchEntry;
}

interface GroupedResults {
  topResult: SearchResultEntry | null;
  tracks: SearchResultEntry[];
  artists: SearchResultEntry[];
  albums: SearchResultEntry[];
  playlists: SearchResultEntry[];
  moods: SearchResultEntry[];
}

const EMPTY_API: SpotifyBrowseSearchResponse = {
  topResult: null,
  tracks: [],
  artists: [],
  albums: [],
  playlists: [],
};

const KIND_LABEL: Record<ResultKind, string> = {
  track: "Song",
  artist: "Artist",
  album: "Album",
  playlist: "Playlist",
  mood: "Mood",
};

const SEARCH_PLACEHOLDER = "Search artists, songs, albums, playlists or moods";

function toSpotifyEntry(item: BrowseSearchItem): SearchResultEntry {
  return {
    id: `${item.type}-${item.id}`,
    kind: item.type,
    label: item.title,
    detail: item.subtitle,
    imageUrl: item.imageUrl || ARTWORK_PLACEHOLDER_SRC,
    spotifyUrl: item.spotifyUrl,
    source: item,
  };
}

function toMoodEntry(item: MoodSearchEntry): SearchResultEntry {
  return {
    id: item.id,
    kind: "mood",
    label: item.label,
    detail: item.detail,
    imageUrl: item.imageUrl,
    mood: item.mood,
    source: item,
  };
}

function buildGroups(
  api: SpotifyBrowseSearchResponse,
  moods: MoodSearchEntry[],
): GroupedResults {
  return {
    topResult: api.topResult ? toSpotifyEntry(api.topResult) : null,
    tracks: api.tracks.map(toSpotifyEntry),
    artists: api.artists.map(toSpotifyEntry),
    albums: api.albums.map(toSpotifyEntry),
    playlists: api.playlists.map(toSpotifyEntry),
    moods: moods.map(toMoodEntry),
  };
}

function flattenGroups(groups: GroupedResults): SearchResultEntry[] {
  const items: SearchResultEntry[] = [];
  if (groups.topResult) {
    items.push(groups.topResult);
  }
  items.push(
    ...groups.tracks,
    ...groups.artists,
    ...groups.albums,
    ...groups.playlists,
    ...groups.moods,
  );
  return items;
}

function isRoundAvatar(kind: ResultKind): boolean {
  return kind === "artist" || kind === "mood";
}

type EmptyPanelItem =
  | { kind: "recent"; query: string; id: string }
  | { kind: "suggestion"; query: string; id: string }
  | { kind: "clear"; id: string };

export function SpotifySearch() {
  const router = useRouter();
  const { selectItem } = useNowSelected();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const comboboxId = useId();
  const listboxId = useId();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [apiResults, setApiResults] = useState<SpotifyBrowseSearchResponse>(EMPTY_API);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(
      () => setDebouncedQuery(query),
      BROWSE_SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(handle);
  }, [query]);

  const trimmedDebounced = debouncedQuery.trim();
  const trimmedQuery = query.trim();
  const showEmptyPanel = isOpen && trimmedQuery.length === 0;
  const showSearchPanel =
    isOpen &&
    trimmedQuery.length >= MIN_BROWSE_SEARCH_LENGTH &&
    trimmedDebounced.length >= MIN_BROWSE_SEARCH_LENGTH;

  const emptyPanelItems = useMemo((): EmptyPanelItem[] => {
    if (recentSearches.length > 0) {
      const items: EmptyPanelItem[] = recentSearches.map((term) => ({
        kind: "recent",
        query: term,
        id: `recent-${term}`,
      }));
      items.push({ kind: "clear", id: "clear-recent" });
      return items;
    }

    return SEARCH_TRY_SUGGESTIONS.map((term) => ({
      kind: "suggestion",
      query: term,
      id: `suggestion-${term}`,
    }));
  }, [recentSearches]);

  const navigableEmptyItems = useMemo(
    () => emptyPanelItems.filter((item) => item.kind !== "clear"),
    [emptyPanelItems],
  );

  useEffect(() => {
    if (!showSearchPanel) {
      setApiResults(EMPTY_API);
      setIsLoading(false);
      setFetchError(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setFetchError(false);

    fetchBrowseSearch(trimmedDebounced, controller.signal)
      .then((data) => {
        setApiResults(data);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setApiResults(EMPTY_API);
        setFetchError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [showSearchPanel, trimmedDebounced]);

  const localMoods = useMemo(
    () => searchMoods(trimmedDebounced, MAX_PER_GROUP),
    [trimmedDebounced],
  );

  const groups = useMemo(
    () => buildGroups(apiResults, localMoods),
    [apiResults, localMoods],
  );

  const flatResults = useMemo(() => flattenGroups(groups), [groups]);
  const hasResults = flatResults.length > 0;

  useEffect(() => {
    if (!showSearchPanel || isLoading) {
      if (!showEmptyPanel) {
        setHighlightIndex(-1);
      }
      return;
    }
    setHighlightIndex(flatResults.length > 0 ? 0 : -1);
  }, [trimmedDebounced, showSearchPanel, flatResults.length, isLoading, showEmptyPanel]);

  useEffect(() => {
    if (!showEmptyPanel) {
      return;
    }
    setHighlightIndex(navigableEmptyItems.length > 0 ? 0 : -1);
  }, [showEmptyPanel, navigableEmptyItems.length, recentSearches]);

  useEffect(() => {
    function onDocumentMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocumentMouseDown);
    return () => document.removeEventListener("mousedown", onDocumentMouseDown);
  }, []);

  function closePanel() {
    setIsOpen(false);
    setHighlightIndex(-1);
  }

  function rememberSearch(rawQuery: string) {
    setRecentSearches(addRecentSearch(rawQuery));
  }

  function executeSearch(rawQuery: string) {
    const term = rawQuery.trim();
    if (term.length < MIN_BROWSE_SEARCH_LENGTH) {
      return;
    }
    rememberSearch(term);
    setQuery(term);
    setDebouncedQuery(term);
    setIsOpen(true);
    inputRef.current?.focus();
  }

  function handleClearRecent() {
    clearRecentSearches();
    setRecentSearches([]);
    setHighlightIndex(navigableEmptyItems.length > 0 ? 0 : -1);
    inputRef.current?.focus();
  }

  function selectEmptyItem(item: EmptyPanelItem) {
    if (item.kind === "clear") {
      handleClearRecent();
      return;
    }
    executeSearch(item.query);
  }

  function selectEntry(entry: SearchResultEntry) {
    if (trimmedQuery.length >= MIN_BROWSE_SEARCH_LENGTH) {
      rememberSearch(trimmedQuery);
    }

    if (entry.kind === "mood" && entry.mood) {
      setDiscoverMoodPrefill(entry.mood);
      router.push("/discover");
      closePanel();
      return;
    }

    if (!entry.spotifyUrl) {
      return;
    }

    if (entry.kind === "track") {
      const track = entry.source as BrowseSearchItem;
      selectItem({
        id: track.id,
        title: entry.label,
        artist: entry.detail,
        type: "Track",
        imageUrl: entry.imageUrl,
        spotifyUrl: entry.spotifyUrl,
      });
    }

    openSpotifyUrl(entry.spotifyUrl);
    closePanel();
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
      inputRef.current?.blur();
      return;
    }

    if (showEmptyPanel && navigableEmptyItems.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightIndex((index) => (index + 1) % navigableEmptyItems.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightIndex((index) =>
          index <= 0 ? navigableEmptyItems.length - 1 : index - 1,
        );
        return;
      }

      if (event.key === "Enter" && highlightIndex >= 0) {
        event.preventDefault();
        const selected = navigableEmptyItems[highlightIndex];
        if (selected) {
          selectEmptyItem(selected);
        }
        return;
      }
    }

    if (!showSearchPanel || isLoading || flatResults.length === 0) {
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
        selectEntry(selected);
      }
    }
  }

  function renderEntry(entry: SearchResultEntry, rowIndex: number) {
    const isHighlighted = rowIndex === highlightIndex;

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
          onClick={() => selectEntry(entry)}
          aria-label={`${entry.label}, ${KIND_LABEL[entry.kind]}`}
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
              isRoundAvatar(entry.kind) ? "rounded-full" : "rounded-md"
            }`}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-white">
              <HighlightMatch text={entry.label} query={trimmedDebounced} />
            </span>
            <span className="block truncate text-xs text-white/55">
              <HighlightMatch text={entry.detail} query={trimmedDebounced} />
            </span>
          </span>
          <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
            {KIND_LABEL[entry.kind]}
          </span>
        </button>
      </li>
    );
  }

  function renderGroup(
    title: string,
    entries: SearchResultEntry[],
    startIndex: number,
  ) {
    if (entries.length === 0) {
      return null;
    }

    return (
      <>
        <li className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-white/40">
          {title}
        </li>
        {entries.map((entry, index) => renderEntry(entry, startIndex + index))}
      </>
    );
  }

  function renderEmptyQueryItem(item: EmptyPanelItem, rowIndex: number) {
    const isHighlighted =
      item.kind !== "clear" && rowIndex === highlightIndex;

    if (item.kind === "clear") {
      return (
        <li key={item.id} className="border-t border-white/[0.08] p-1">
          <button
            type="button"
            onClick={handleClearRecent}
            className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Clear Recent Searches
          </button>
        </li>
      );
    }

    return (
      <li
        key={item.id}
        id={`${listboxId}-${item.id}`}
        role="option"
        aria-selected={isHighlighted}
      >
        <button
          type="button"
          onMouseEnter={() => setHighlightIndex(rowIndex)}
          onClick={() => selectEmptyItem(item)}
          aria-label={`Search for ${item.query}`}
          className={`flex w-full items-center px-3 py-2.5 text-left text-sm text-white transition-colors duration-150 ${
            isHighlighted ? "bg-[#333333]" : "hover:bg-[#333333]"
          }`}
        >
          <span className="mr-2 text-white/40" aria-hidden="true">
            •
          </span>
          {item.query}
        </button>
      </li>
    );
  }

  function renderEmptyPanel() {
    const hasRecent = recentSearches.length > 0;

    return (
      <div className="py-1">
        {hasRecent ? (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Recent searches"
            className="max-h-[min(400px,55vh)] overflow-y-auto"
          >
            <li className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-white/40">
              Recent Searches
            </li>
            {emptyPanelItems.map((item, index) => {
              if (item.kind === "clear") {
                return renderEmptyQueryItem(item, -1);
              }
              const rowIndex = navigableEmptyItems.findIndex(
                (entry) => entry.id === item.id,
              );
              return renderEmptyQueryItem(item, rowIndex);
            })}
          </ul>
        ) : (
          <div className="px-4 py-4">
            <p className="text-sm text-white/60">Start typing to search Spotify</p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-white/40">
              Try:
            </p>
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Suggested searches"
              className="mt-1"
            >
              {emptyPanelItems.map((item, index) =>
                renderEmptyQueryItem(item, index),
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const panelOpen = showEmptyPanel || showSearchPanel;
  const activeDescendant =
    highlightIndex >= 0
      ? showEmptyPanel && navigableEmptyItems[highlightIndex]
        ? `${listboxId}-${navigableEmptyItems[highlightIndex].id}`
        : showSearchPanel && flatResults[highlightIndex]
          ? `${listboxId}-${flatResults[highlightIndex].id}`
          : undefined
      : undefined;

  const trackOffset = groups.topResult ? 1 : 0;
  const artistOffset = trackOffset + groups.tracks.length;
  const albumOffset = artistOffset + groups.artists.length;
  const playlistOffset = albumOffset + groups.albums.length;
  const moodOffset = playlistOffset + groups.playlists.length;

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-full min-w-0 max-w-full flex-1 xl:max-w-[480px]"
    >
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-white/45 xl:left-4 xl:h-[18px] xl:w-[18px]"
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
        onClick={() => setIsOpen(true)}
        onKeyDown={onInputKeyDown}
        placeholder={SEARCH_PLACEHOLDER}
        autoComplete="off"
        role="combobox"
        aria-expanded={panelOpen}
        aria-controls={panelOpen ? listboxId : undefined}
        aria-autocomplete="list"
        aria-busy={isLoading}
        aria-activedescendant={activeDescendant}
        aria-label={SEARCH_PLACEHOLDER}
        className="h-10 w-full rounded-full bg-[#282828] pl-11 pr-4 text-sm text-white placeholder:text-white/45 transition-colors duration-150 hover:bg-[#333333] focus-visible:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-11 xl:h-12 xl:pl-12 xl:pr-5"
      />

      {showEmptyPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border border-white/[0.08] bg-[#282828] shadow-[0_16px_48px_rgba(0,0,0,0.65)]">
          {renderEmptyPanel()}
        </div>
      )}

      {showSearchPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border border-white/[0.08] bg-[#282828] shadow-[0_16px_48px_rgba(0,0,0,0.65)]">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-5 text-sm text-white/60">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Searching Spotify…</span>
            </div>
          ) : fetchError ? (
            <p className="px-4 py-5 text-sm text-white/60">
              Could not search Spotify. Please try again.
            </p>
          ) : !hasResults ? (
            <p className="px-4 py-5 text-sm text-white/60">No results found</p>
          ) : (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Search results"
              className="max-h-[min(400px,55vh)] overflow-y-auto py-1"
            >
              {groups.topResult &&
                renderGroup("Top Result", [groups.topResult], 0)}
              {renderGroup("Songs", groups.tracks, trackOffset)}
              {renderGroup("Artists", groups.artists, artistOffset)}
              {renderGroup("Albums", groups.albums, albumOffset)}
              {renderGroup("Playlists", groups.playlists, playlistOffset)}
              {renderGroup("Moods", groups.moods, moodOffset)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
