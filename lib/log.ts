/**
 * Lightweight development-only logging. Silent in production so it never
 * affects production behavior. Never pass secrets or full tokens here.
 */
export function devLog(...args: unknown[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.log("[dev]", ...args);
  }
}
