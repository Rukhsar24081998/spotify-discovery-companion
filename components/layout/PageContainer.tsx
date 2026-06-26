import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

/**
 * Scrollable main content region inside the home shell.
 */
export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-[#121212] pb-28">
      <div className="mx-auto max-w-[1400px] px-6 pb-6 pt-1">{children}</div>
    </main>
  );
}
