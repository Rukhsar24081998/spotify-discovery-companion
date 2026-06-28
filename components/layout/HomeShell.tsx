"use client";

import type { ReactNode } from "react";
import { AppSessionProvider, useAppSession } from "@/components/layout/AppSessionContext";
import { PlaybackProvider } from "@/components/layout/BottomPlayer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PageContainer } from "@/components/layout/PageContainer";
import { MyLibraryProvider } from "@/components/layout/MyLibraryContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";

interface HomeShellProps {
  children: ReactNode;
  activeItem?: "home" | "discover";
}

function HomeShellInner({ children, activeItem = "home" }: HomeShellProps) {
  const { sessionKey } = useAppSession();

  return (
    <PlaybackProvider
      key={sessionKey}
      emptyState={activeItem === "discover" ? "recommendations" : "browse"}
    >
      <div className="flex min-h-screen flex-col overflow-x-hidden bg-black">
        <div className="flex min-h-0 flex-1 gap-0 md:p-2 md:pl-0 xl:p-2 xl:pl-0">
          <Sidebar activeItem={activeItem} />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#121212] md:rounded-lg">
            <TopNavigation />
            <PageContainer>{children}</PageContainer>
          </div>
        </div>
        <MobileBottomNav activeItem={activeItem} />
      </div>
    </PlaybackProvider>
  );
}

/**
 * Full Spotify-style app shell shared by home and discover pages.
 */
export function HomeShell(props: HomeShellProps) {
  return (
    <AppSessionProvider>
      <MyLibraryProvider>
        <HomeShellInner {...props} />
      </MyLibraryProvider>
    </AppSessionProvider>
  );
}
