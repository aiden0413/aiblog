"use client";

import { useState } from "react";
import type { BlogHistoryItem } from "@/lib/blogHistory";
import { STYLE_LABELS } from "@/lib/blogHistory";
import { HiOutlineTrash } from "react-icons/hi";
import { ConfirmModal } from "../../components/commons/ConfirmModal";

interface HistoryPanelProps {
  /** 패널 표시 여부. */
  isOpen: boolean;
  /** 패널 닫기 콜백. */
  onClose: () => void;
  /** 표시할 히스토리 항목 목록. */
  items: BlogHistoryItem[];
  /** 항목 클릭 시 호출. 선택된 항목을 인자로 전달. */
  onSelectItem?: (item: BlogHistoryItem) => void;
  /** 항목 삭제 시 호출. 삭제할 항목의 인덱스를 인자로 전달. */
  onRemoveItem?: (index: number) => void;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function HistoryPanel({ isOpen, items, onSelectItem, onRemoveItem }: HistoryPanelProps) {
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

  return (
    <>
      <ConfirmModal
        isOpen={pendingDeleteIndex !== null}
        title="히스토리 삭제"
        message="이 항목을 히스토리에서 삭제할까요?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => {
          if (pendingDeleteIndex !== null) {
            onRemoveItem?.(pendingDeleteIndex);
            setPendingDeleteIndex(null);
          }
        }}
        onCancel={() => setPendingDeleteIndex(null)}
      />
      {/* 우측 슬라이드 패널. 열림·닫힘 시 translateX 전환. 전환 애니메이션 적용 여부는 globals.css의 data-allow-transition 정책을 따름. */}
      <div
        data-allow-transition
        className="fixed right-0 z-50 w-full max-w-[280px] border-l border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 top-[81px] bottom-[4.5rem] md:bottom-0"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        aria-modal="true"
        aria-label="히스토리"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex shrink-0 items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              히스토리
            </h2>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  생성한 글이 없습니다.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item, index) => {
                  const hasResult = Boolean(item.result);
                  return (
                    <li
                      key={`${item.createdAt}-${index}`}
                      role={hasResult ? "button" : undefined}
                      tabIndex={hasResult ? 0 : undefined}
                      onClick={() => hasResult && onSelectItem?.(item)}
                      onKeyDown={(e) => {
                        if (hasResult && onSelectItem && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          onSelectItem(item);
                        }
                      }}
                      className={`relative rounded-lg border border-zinc-200 bg-zinc-50 p-3 pr-10 dark:border-zinc-700 dark:bg-zinc-800 ${
                        hasResult
                          ? "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700"
                          : "opacity-75"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDeleteIndex(index);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-600 dark:hover:text-zinc-200"
                        aria-label="항목 삭제"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">
                        {item.topic}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {item.keywords.length > 0 ? item.keywords.join(", ") : "-"}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{STYLE_LABELS[item.style]}</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
