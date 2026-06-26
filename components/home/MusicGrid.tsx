export interface MusicGridItem {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
}

interface MusicGridProps {
  heading: string;
  items: MusicGridItem[];
  id?: string;
  showAll?: boolean;
}

/**
 * Vertical playlist-style card grid for "Made For You" sections.
 */
export function MusicGrid({ heading, items, id, showAll = false }: MusicGridProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      aria-label={headingId ? undefined : heading}
      className="mb-10"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id={headingId} className="text-2xl font-bold tracking-tight text-white">
          {heading}
        </h2>
        {showAll && (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="text-xs font-bold uppercase tracking-wide text-white/45 hover:text-white"
          >
            Show all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled
            aria-disabled="true"
            className="group rounded-lg bg-[#181818] p-4 text-left transition-colors duration-200 hover:bg-[#282828]"
          >
            <div
              className={`relative mb-4 aspect-square w-full overflow-hidden rounded-md bg-gradient-to-br shadow-[0_4px_16px_rgba(0,0,0,0.4)] ${item.gradient}`}
              aria-hidden="true"
            >
              <span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-black opacity-0 shadow-lg transition-all duration-200 group-hover:bottom-3 group-hover:opacity-100">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-black" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
            <p className="mb-1 truncate text-base font-bold text-white">{item.title}</p>
            <p className="line-clamp-2 text-sm leading-snug text-white/55">{item.subtitle}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
