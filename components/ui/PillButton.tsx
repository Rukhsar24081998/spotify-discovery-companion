import type { ButtonHTMLAttributes } from "react";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Strong selected state for single-select groups (Mood/Activity in Phase 04). */
  selected?: boolean;
}

const BASE =
  "inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2 text-support font-semibold " +
  "transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:hover:translate-y-0 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

const SELECTED =
  "bg-accent text-black shadow-[0_4px_16px_rgba(29,185,84,0.35)] hover:bg-accent-hover hover:shadow-[0_6px_20px_rgba(29,185,84,0.45)]";
const UNSELECTED =
  "border border-white/10 bg-[#282828] text-white/80 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#333333] hover:text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)]";

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
