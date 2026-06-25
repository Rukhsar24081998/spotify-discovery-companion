import type { ReactNode } from "react";

interface CardShellProps {
  children: ReactNode;
  /** Adds subtle hover elevation; use for cards that act as a single target. */
  interactive?: boolean;
  className?: string;
}

/**
 * Dark-gray surface container shared by DiscoveryCard (Phase 03) and
 * RecommendationCard (Phase 09). Hover elevation respects reduced motion.
 */
export function CardShell({
  children,
  interactive = false,
  className = "",
}: CardShellProps) {
  const base = "rounded-2xl bg-surface p-6 shadow-card";
  const hover = interactive
    ? "transition-all duration-200 motion-reduce:transition-none hover:bg-surface-hover hover:shadow-card-hover"
    : "";
  const classes = `${base} ${hover} ${className}`.trim();

  return <div className={classes}>{children}</div>;
}
