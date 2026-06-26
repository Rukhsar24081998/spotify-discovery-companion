"use client";

import { useState } from "react";

const CATEGORIES = ["All", "Music", "Podcasts", "Audiobooks"] as const;

/**
 * Filter chips below the top navigation — selectable browse categories.
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
            className={`inline-flex min-h-[32px] cursor-pointer items-center rounded-full px-4 py-1 text-xs font-semibold transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] active:scale-95 ${
              selected
                ? "bg-accent text-black shadow-[0_4px_12px_rgba(29,185,84,0.25)]"
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
