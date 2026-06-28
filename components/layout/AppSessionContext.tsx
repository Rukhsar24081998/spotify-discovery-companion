"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AppSessionContextValue {
  sessionKey: number;
  resetSession: () => void;
}

const AppSessionContext = createContext<AppSessionContextValue | null>(null);

export function useAppSession(): AppSessionContextValue {
  const context = useContext(AppSessionContext);
  if (!context) {
    throw new Error("useAppSession must be used within AppSessionProvider");
  }
  return context;
}

interface AppSessionProviderProps {
  children: ReactNode;
}

/**
 * Client session scope for reset — remounts playback and discovery state without backend.
 */
export function AppSessionProvider({ children }: AppSessionProviderProps) {
  const router = useRouter();
  const [sessionKey, setSessionKey] = useState(0);

  const resetSession = useCallback(() => {
    setSessionKey((current) => current + 1);
    router.push("/");
  }, [router]);

  const value = useMemo(
    () => ({
      sessionKey,
      resetSession,
    }),
    [sessionKey, resetSession],
  );

  return (
    <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>
  );
}
