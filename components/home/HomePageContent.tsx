"use client";

import { useState } from "react";
import { AiPickForYou } from "@/components/home/AiPickForYou";
import { CategoryTabs, type HomeCategory } from "@/components/home/CategoryTabs";
import { GoodEvening } from "@/components/home/GoodEvening";
import { HeroCard } from "@/components/home/HeroCard";
import {
  AiPicksForYouSection,
  BecauseArcticMonkeysSection,
  BecauseTheWeekndSection,
  DailyMixesSection,
  DiscoverWeeklySection,
  EditorsPicksSection,
  JumpBackInSection,
  MadeForYouSection,
  NewReleasesSection,
  PopularAlbumsSection,
  ReleaseRadarSection,
  TrendingNowSection,
} from "@/components/home/HomeBrowseSections";
import { RecentlyPlayed } from "@/components/home/RecentlyPlayed";

function MusicShelves() {
  return (
    <>
      <GoodEvening />
      <RecentlyPlayed />
      <AiPickForYou />
      <MadeForYouSection />
      <DailyMixesSection />
      <DiscoverWeeklySection />
      <ReleaseRadarSection />
      <JumpBackInSection />
      <TrendingNowSection />
      <PopularAlbumsSection />
      <NewReleasesSection />
      <BecauseArcticMonkeysSection />
      <BecauseTheWeekndSection />
      <EditorsPicksSection />
      <AiPicksForYouSection />
    </>
  );
}

/**
 * Client-side homepage shell — category chips filter visible shelves instantly.
 */
export function HomePageContent() {
  const [category, setCategory] = useState<HomeCategory>("All");

  const showMusicShelves = category === "All" || category === "Music";

  return (
    <>
      <CategoryTabs active={category} onChange={setCategory} />

      {category === "All" && <HeroCard />}

      {showMusicShelves && <MusicShelves />}
    </>
  );
}
