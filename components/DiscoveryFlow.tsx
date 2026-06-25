"use client";

import { useState } from "react";
import type { Activity, DiscoverRequest, Mood } from "@/types";
import { Heading } from "@/components/ui/Heading";
import { MoodSelector } from "@/components/MoodSelector";
import { ActivitySelector } from "@/components/ActivitySelector";
import { ArtistSearch } from "@/components/ArtistSearch";
import { LoadingState } from "@/components/LoadingState";

type FlowPhase = "input" | "loading";

/**
 * Assemble the /api/discover payload from the collected context. Returns null
 * until both required fields are chosen. Phase 05/09 will POST this object.
 */
function buildDiscoverRequest(
  mood: Mood | null,
  activity: Activity | null,
  favoriteArtists: string[],
): DiscoverRequest | null {
  if (!mood || !activity) {
    return null;
  }
  return favoriteArtists.length > 0
    ? { mood, activity, favoriteArtists }
    : { mood, activity };
}

/**
 * Discovery Companion flow container (Screens 2–3). Holds only the state this
 * phase needs; backend wiring and the results screen arrive in Phases 05/09.
 */
export function DiscoveryFlow() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>([]);
  const [phase, setPhase] = useState<FlowPhase>("input");

  const canSubmit = mood !== null && activity !== null;

  function handleSubmit() {
    const request = buildDiscoverRequest(mood, activity, favoriteArtists);
    if (!request) {
      return;
    }
    setPhase("loading");
  }

  if (phase === "loading") {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col gap-8">
      <Heading level={1}>Let&apos;s find something you&apos;ll love.</Heading>

      <MoodSelector value={mood} onChange={setMood} />
      <hr className="border-white/10" />
      <ActivitySelector value={activity} onChange={setActivity} />
      <hr className="border-white/10" />
      <ArtistSearch value={favoriteArtists} onChange={setFavoriteArtists} />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-body font-semibold text-black transition-colors duration-150 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-white/40 sm:w-auto sm:self-start"
      >
        Discover Music
      </button>
    </div>
  );
}
