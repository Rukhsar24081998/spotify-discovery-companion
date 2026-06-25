import type { ReactNode } from "react";

type HeadingLevel = 1 | 2 | 3;

interface HeadingProps {
  level?: HeadingLevel;
  children: ReactNode;
  className?: string;
}

const LEVEL_STYLES: Record<HeadingLevel, string> = {
  1: "text-display font-bold text-white",
  2: "text-heading font-semibold text-white",
  3: "text-title font-semibold text-white",
};

/**
 * Typographic heading enforcing the documented hierarchy
 * (ui-guidelines.md -> Typography). Renders the matching semantic tag.
 */
export function Heading({ level = 2, children, className = "" }: HeadingProps) {
  const styles = LEVEL_STYLES[level];
  const classes = `${styles} ${className}`.trim();

  if (level === 1) {
    return <h1 className={classes}>{children}</h1>;
  }
  if (level === 2) {
    return <h2 className={classes}>{children}</h2>;
  }
  return <h3 className={classes}>{children}</h3>;
}
