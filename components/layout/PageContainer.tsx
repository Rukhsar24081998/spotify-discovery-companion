import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

/**
 * Scrollable main content region inside the home shell.
 */
export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#121212] pb-32 md:pb-20 xl:pb-20">
      <div className="w-full min-w-0 px-4 pb-5 pt-0 md:px-5 xl:px-6">{children}</div>
    </main>
  );
}
