import type { ReactNode } from "react";
import { BottomPlayer } from "@/components/layout/BottomPlayer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";

interface HomeShellProps {
  children: ReactNode;
  activeItem?: "home" | "discover";
}

/**
 * Full Spotify-style app shell shared by home and discover pages.
 */
export function HomeShell({ children, activeItem = "home" }: HomeShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="flex min-h-0 flex-1 gap-0 p-2 pl-0">
        <Sidebar activeItem={activeItem} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-[#121212]">
          <TopNavigation />
          <PageContainer>{children}</PageContainer>
        </div>
      </div>
      <BottomPlayer />
    </div>
  );
}
