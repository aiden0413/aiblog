"use client";

import { useEffect } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

export function LoginModal({ isOpen, onClose, onSignIn }: LoginModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/60"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <h2
          id="login-modal-title"
          className="text-lg font-semibold text-zinc-800 dark:text-zinc-200"
        >
          로그인
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Google 계정으로 로그인합니다.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 min-w-24 rounded border border-zinc-300 bg-white px-4 py-2 font-medium text-zinc-700 outline-none hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:focus:ring-zinc-500"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              onSignIn();
            }}
            className="h-10 min-w-24 rounded border border-purple-500 bg-purple-500 px-4 py-2 font-medium text-white outline-none hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 dark:border-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-600"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
