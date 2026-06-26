import { Play } from "lucide-react";

interface ShortcutItem {
  id: string;
  label: string;
  gradient: string;
}

const RECENTLY_PLAYED: ShortcutItem[] = [
  { id: "arctic-monkeys", label: "The Car - Arctic Monkeys", gradient: "from-stone-500 to-stone-900" },
  { id: "sza", label: "SOS - SZA", gradient: "from-sky-600 to-slate-900" },
  { id: "taylor-swift", label: "Midnights - Taylor Swift", gradient: "from-indigo-700 to-slate-950" },
  { id: "the-weeknd", label: "Dawn FM - The Weeknd", gradient: "from-orange-600 to-zinc-900" },
];

/**
 * "Good Evening" shortcut grid from the home mockup (2×2 horizontal cards).
 */
export function RecentlyPlayed() {
  return (
    <section id="good-evening" aria-labelledby="good-evening-heading" className="mb-10">
      <h2 id="good-evening-heading" className="mb-4 text-2xl font-bold tracking-tight text-white">
        Good Evening
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {RECENTLY_PLAYED.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled
            aria-disabled="true"
            className="group relative flex h-[68px] overflow-hidden rounded-md bg-[#282828] text-left transition-colors duration-200 hover:bg-[#3e3e3e]"
          >
            <div
              className={`h-full w-[68px] shrink-0 bg-gradient-to-br shadow-[2px_0_8px_rgba(0,0,0,0.3)] ${item.gradient}`}
              aria-hidden="true"
            />
            <span className="flex flex-1 items-center truncate px-4 text-sm font-bold text-white">
              {item.label}
            </span>
            <span className="pointer-events-none absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full bg-accent text-black opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              <Play className="h-5 w-5 fill-black" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
