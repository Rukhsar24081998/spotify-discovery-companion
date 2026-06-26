"use client";

import { useState } from "react";

const CATEGORIES = ["All", "Music", "Podcasts", "Audiobooks"] as const;

/**
 * Filter chips below the top navigation (visual only on home).
 */
export function CategoryTabs() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  return (
    <div
      role="tablist"
      aria-label="Browse categories"
      className="mb-7 flex flex-wrap gap-2"
    >
      {CATEGORIES.map((category) => {
        const selected = active === category;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => setActive(category)}
            className={`inline-flex min-h-[32px] items-center rounded-full px-4 py-1 text-xs font-semibold transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              selected
                ? "bg-accent text-black"
                : "border border-white/10 bg-[#282828] text-white/75 hover:border-white/20 hover:bg-[#333333] hover:text-white"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
