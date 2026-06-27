import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

/**
 * Scrollable main content region inside the home shell.
 */
export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-[#121212] pb-20">
      <div className="w-full px-4 pb-5 pt-0 sm:px-6">{children}</div>
    </main>
  );
}
