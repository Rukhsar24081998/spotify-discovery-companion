"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Recommendation } from "@/types";
import {
  getSavedRecommendations,
  removeSavedRecommendation,
  toggleSavedRecommendation,
  type SavedRecommendation,
} from "@/lib/savedRecommendations";

interface MyLibraryContextValue {
  saved: SavedRecommendation[];
  count: number;
  isSaved: (id: string) => boolean;
  toggleSave: (recommendation: Recommendation) => void;
  removeSaved: (id: string) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const MyLibraryContext = createContext<MyLibraryContextValue | null>(null);

export function useMyLibrary(): MyLibraryContextValue {
  const context = useContext(MyLibraryContext);
  if (!context) {
    throw new Error("useMyLibrary must be used within MyLibraryProvider");
  }
  return context;
}

/** @deprecated Use useMyLibrary */
export const useSavedRecommendations = useMyLibrary;

interface MyLibraryProviderProps {
  children: ReactNode;
}

export function MyLibraryProvider({ children }: MyLibraryProviderProps) {
  const [saved, setSaved] = useState<SavedRecommendation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSaved(getSavedRecommendations());
  }, []);

  const savedIds = useMemo(() => new Set(saved.map((item) => item.id)), [saved]);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggleSave = useCallback((recommendation: Recommendation) => {
    setSaved(toggleSavedRecommendation(recommendation));
  }, []);

  const removeSaved = useCallback((id: string) => {
    setSaved(removeSavedRecommendation(id));
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      saved,
      count: saved.length,
      isSaved,
      toggleSave,
      removeSaved,
      isModalOpen,
      openModal,
      closeModal,
    }),
    [saved, isSaved, toggleSave, removeSaved, isModalOpen, openModal, closeModal],
  );

  return (
    <MyLibraryContext.Provider value={value}>{children}</MyLibraryContext.Provider>
  );
}

/** @deprecated Use MyLibraryProvider */
export const SavedRecommendationsProvider = MyLibraryProvider;
