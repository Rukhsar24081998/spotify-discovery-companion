import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label; required because the button has no visible text. */
  label: string;
  children: ReactNode;
}

const BASE =
  "inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 " +
  "transition-colors duration-150 motion-reduce:transition-none " +
  "hover:bg-surface-hover hover:text-white " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Accessible icon-only button. The icon is passed as children; `label` provides
 * the accessible name. Reused by card actions in later phases.
 */
export function IconButton({
  label,
  type = "button",
  className = "",
  children,
  ...rest
}: IconButtonProps) {
  const classes = `${BASE} ${className}`.trim();

  return (
    <button type={type} aria-label={label} className={classes} {...rest}>
      {children}
    </button>
  );
}
