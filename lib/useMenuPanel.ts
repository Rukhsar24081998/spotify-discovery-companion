"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface UseMenuPanelOptions {
  onClose?: () => void;
}

/**
 * Shared open/close, outside-click, Escape, and focus-trap behavior for header menus.
 */
export function useMenuPanel(options: UseMenuPanelOptions = {}) {
  const { onClose } = options;
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
    triggerRef.current?.focus();
  }, [onClose]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onDocumentMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function onDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }

    document.addEventListener("mousedown", onDocumentMouseDown);
    document.addEventListener("keydown", onDocumentKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown);
      document.removeEventListener("keydown", onDocumentKeyDown);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) {
      return;
    }

    const panel = panelRef.current;
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );

    focusables[0]?.focus();

    function onPanelKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    panel.addEventListener("keydown", onPanelKeyDown);
    return () => panel.removeEventListener("keydown", onPanelKeyDown);
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
    rootRef,
    triggerRef,
    panelRef,
  };
}
