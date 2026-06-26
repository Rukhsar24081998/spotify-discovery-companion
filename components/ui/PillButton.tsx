import type { ButtonHTMLAttributes } from "react";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Strong selected state for single-select groups (Mood/Activity in Phase 04). */
  selected?: boolean;
}

const BASE =
  "inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2 text-support font-medium " +
  "transition-colors duration-150 motion-reduce:transition-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

const SELECTED = "bg-accent text-black hover:bg-accent-hover";
const UNSELECTED = "bg-surface text-white/80 hover:bg-surface-hover hover:text-white";

/**
 * Rounded pill button with a strong selected state, subtle hover, and a visible
 * keyboard focus ring. Reusable selection primitive (ui-guidelines.md).
 */
export function PillButton({
  selected = false,
  type = "button",
  className = "",
  children,
  ...rest
}: PillButtonProps) {
  const classes = `${BASE} ${selected ? SELECTED : UNSELECTED} ${className}`.trim();

  return (
    <button type={type} aria-pressed={selected} className={classes} {...rest}>
      {children}
    </button>
  );
}
