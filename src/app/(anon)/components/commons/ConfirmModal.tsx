"use client";

import { useEffect } from "react";

export interface ConfirmModalProps {
  /** 모달 표시 여부. */
  isOpen: boolean;
  /** 모달 제목. */
  title: string;
  /** 모달 본문 메시지. */
  message: string;
  /** 확인 버튼 라벨. */
  confirmText: string;
  /** 취소 버튼 라벨. */
  cancelText: string;
  /** 확인 버튼 클릭 시 호출. */
  onConfirm: () => void;
  /** 취소 버튼 클릭 또는 배경·Esc 시 호출. */
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const confirmClassName =
    "h-10 min-w-24 rounded border border-purple-500 bg-purple-500 px-4 py-2 font-medium text-white outline-none hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 dark:border-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-600";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/60"
        aria-hidden="true"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <h2
          id="confirm-modal-title"
          className="text-lg font-semibold text-zinc-800 dark:text-zinc-200"
        >
          {title}
        </h2>
        <p
          id="confirm-modal-desc"
          className="mt-2 text-sm text-zinc-600 dark:text-zinc-400"
        >
          {message}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 min-w-24 rounded border border-zinc-300 bg-white px-4 py-2 font-medium text-zinc-700 outline-none hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:focus:ring-zinc-500"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={confirmClassName}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
