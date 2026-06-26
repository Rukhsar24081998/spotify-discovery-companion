"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import {
  MAX_FAVORITE_ARTISTS,
  type ArtistSuggestion,
  type SpotifySearchResponse,
} from "@/types";

interface ArtistSearchProps {
  value: string[];
  onChange: (artists: string[]) => void;
}

const DEBOUNCE_MS = 250;
const SUGGESTIONS_UNAVAILABLE_MESSAGE =
  "Suggestions unavailable — you can still type an artist name.";

type FetchResult =
  | { ok: true; artists: ArtistSuggestion[] }
  | { ok: false; artists: ArtistSuggestion[] };

async function fetchArtistSuggestions(
  query: string,
  signal: AbortSignal,
): Promise<FetchResult> {
  const response = await fetch(
    `/api/spotify/search?q=${encodeURIComponent(query)}&type=artist`,
    { signal },
  );
  if (!response.ok) {
    return { ok: false, artists: [] };
  }
  const data = (await response.json()) as SpotifySearchResponse;
  return { ok: true, artists: data.artists ?? [] };
}

/** Optional artist autocomplete: debounced, live Spotify search, max 3 chips. */
export function ArtistSearch({ value, onChange }: ArtistSearchProps) {
  const inputId = useId();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ArtistSuggestion[]>([]);
  const [suggestionsUnavailable, setSuggestionsUnavailable] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const atLimit = value.length >= MAX_FAVORITE_ARTISTS;

  useEffect(() => {
    if (atLimit || query.trim() === "") {
      setSuggestions([]);
      setSuggestionsUnavailable(false);
      setActiveIndex(-1);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const result = await fetchArtistSuggestions(query.trim(), controller.signal);
        setSuggestions(result.artists);
        setSuggestionsUnavailable(!result.ok);
        setActiveIndex(result.artists.length > 0 ? 0 : -1);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setSuggestions([]);
          setSuggestionsUnavailable(true);
          setActiveIndex(-1);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, atLimit]);

  function addArtist(name: string) {
    const trimmed = name.trim();
    const exists = value.some(
      (artist) => artist.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!trimmed || exists || atLimit) {
      return;
    }
    onChange([...value, trimmed]);
    setQuery("");
    setSuggestions([]);
    setSuggestionsUnavailable(false);
    setActiveIndex(-1);
  }

  function removeArtist(name: string) {
    onChange(value.filter((artist) => artist !== name));
  }

  function selectActiveSuggestion() {
    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      addArtist(suggestions[activeIndex].name);
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length === 0) {
      if (event.key === "Escape") {
        setQuery("");
        setSuggestionsUnavailable(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current > 0 ? current - 1 : suggestions.length - 1,
      );
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectActiveSuggestion();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setSuggestions([]);
      setActiveIndex(-1);
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <label htmlFor={inputId} className="text-title font-semibold text-white">
        Artists you already love{" "}
        <span className="text-support font-normal text-white/50">(Optional)</span>
      </label>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Selected artists">
          {value.map((artist) => (
            <li key={artist}>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface py-1.5 pl-3 pr-1 text-support text-white">
                {artist}
                <button
                  type="button"
                  onClick={() => removeArtist(artist)}
                  aria-label={`Remove ${artist}`}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors duration-150 motion-reduce:transition-none hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {atLimit ? (
        <p className="text-support text-white/50">
          You can add up to {MAX_FAVORITE_ARTISTS} artists.
        </p>
      ) : (
        <div className="relative flex flex-col gap-2">
          <input
            id={inputId}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search..."
            autoComplete="off"
            role="combobox"
            aria-expanded={suggestions.length > 0}
            aria-controls={suggestions.length > 0 ? listboxId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 && suggestions[activeIndex]
                ? `${listboxId}-option-${suggestions[activeIndex].id}`
                : undefined
            }
            className="w-full rounded-xl bg-surface px-4 py-3 text-body text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />

          {suggestionsUnavailable && query.trim() !== "" && (
            <p role="status" className="text-support text-white/60">
              {SUGGESTIONS_UNAVAILABLE_MESSAGE}
            </p>
          )}

          {suggestions.length > 0 && (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Artist suggestions"
              className="absolute top-full z-10 mt-2 w-full overflow-hidden rounded-xl bg-surface-hover shadow-card-hover"
            >
              {suggestions.map((artist, index) => (
                <li
                  key={artist.id}
                  id={`${listboxId}-option-${artist.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <button
                    type="button"
                    onClick={() => addArtist(artist.name)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full px-4 py-3 text-left text-body transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                      index === activeIndex
                        ? "bg-surface text-white"
                        : "text-white/90 hover:bg-surface"
                    }`}
                  >
                    {artist.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
