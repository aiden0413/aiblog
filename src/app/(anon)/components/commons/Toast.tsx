"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type ShowToast = (message: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

const TOAST_DURATION_MS = 3000;

/** 상단 중앙 (헤더 아래) */
const toastClassName =
  "fixed left-1/2 top-24 z-[100] -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    timeoutRef.current = setTimeout(() => {
      setMessage(null);
      timeoutRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  const toastEl =
    typeof document !== "undefined" && message ? (
      createPortal(
        <div role="alert" className={toastClassName}>
          {message}
        </div>,
        document.getElementById("modal-root") ?? document.body
      )
    ) : null;

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toastEl}
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  const showToast = useContext(ToastContext);
  if (showToast == null) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return showToast;
}
