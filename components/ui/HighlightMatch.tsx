import { Fragment } from "react";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface HighlightMatchProps {
  text: string;
  query: string;
  className?: string;
}

/** Highlights the query substring within result labels (Spotify-style). */
export function HighlightMatch({ text, query, className = "" }: HighlightMatchProps) {
  const needle = query.trim();
  if (!needle) {
    return <span className={className}>{text}</span>;
  }

  const pattern = new RegExp(`(${escapeRegExp(needle)})`, "gi");
  const parts = text.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === needle.toLowerCase() ? (
          <mark
            key={`${part}-${index}`}
            className="bg-transparent font-semibold text-white"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={`${part}-${index}`}>{part}</Fragment>
        ),
      )}
    </span>
  );
}
