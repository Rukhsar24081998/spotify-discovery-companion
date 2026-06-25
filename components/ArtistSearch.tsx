"use client";

import { useEffect, useId, useState } from "react";
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

async function fetchArtistSuggestions(
  query: string,
  signal: AbortSignal,
): Promise<ArtistSuggestion[]> {
  const response = await fetch(
    `/api/spotify/search?q=${encodeURIComponent(query)}&type=artist`,
    { signal },
  );
  if (!response.ok) {
    return [];
  }
  const data = (await response.json()) as SpotifySearchResponse;
  return data.artists ?? [];
}

/** Optional artist autocomplete: debounced, live Spotify search, max 3 chips. */
export function ArtistSearch({ value, onChange }: ArtistSearchProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ArtistSuggestion[]>([]);

  const atLimit = value.length >= MAX_FAVORITE_ARTISTS;

  useEffect(() => {
    if (atLimit || query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const results = await fetchArtistSuggestions(query.trim(), controller.signal);
        setSuggestions(results);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setSuggestions([]);
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
  }

  function removeArtist(name: string) {
    onChange(value.filter((artist) => artist !== name));
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
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-support text-white">
                {artist}
                <button
                  type="button"
                  onClick={() => removeArtist(artist)}
                  aria-label={`Remove ${artist}`}
                  className="rounded-full text-white/60 transition-colors duration-150 motion-reduce:transition-none hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
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
        <div className="relative">
          <input
            id={inputId}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            autoComplete="off"
            className="w-full rounded-xl bg-surface px-4 py-3 text-body text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />

          {suggestions.length > 0 && (
            <ul
              role="listbox"
              aria-label="Artist suggestions"
              className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl bg-surface-hover shadow-card-hover"
            >
              {suggestions.map((artist) => (
                <li key={artist.id} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onClick={() => addArtist(artist.name)}
                    className="w-full px-4 py-2.5 text-left text-body text-white/90 transition-colors duration-150 motion-reduce:transition-none hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
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
