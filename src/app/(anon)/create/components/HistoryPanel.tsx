"use client";

import { useState, useEffect } from "react";
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
  /** 삭제 API 요청 중 여부. true일 때 확인 모달에 "삭제 중..." 표시. */
  isDeleting?: boolean;
  /** 히스토리 목록 불러오기 실패 시 에러 메시지. 있으면 패널 상단에 표시. */
  fetchError?: string | null;
  /** 불러오기 재시도 콜백. fetchError가 있을 때 "다시 시도" 버튼에 사용. */
  onRetryFetch?: () => void;
  /** 항목 삭제 실패 시 에러 메시지. 있으면 패널 상단에 표시. */
  deleteError?: string | null;
  /** 삭제 에러 메시지 닫기 콜백. */
  onDismissDeleteError?: () => void;
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

export function HistoryPanel({
  isOpen,
  items,
  onSelectItem,
  onRemoveItem,
  isDeleting = false,
  fetchError = null,
  onRetryFetch,
  deleteError = null,
  onDismissDeleteError,
}: HistoryPanelProps) {
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [deleteRequested, setDeleteRequested] = useState(false);

  useEffect(() => {
    if (!deleteRequested || isDeleting) return;
    const id = setTimeout(() => {
      setPendingDeleteIndex(null);
      setDeleteRequested(false);
    }, 0);
    return () => clearTimeout(id);
  }, [deleteRequested, isDeleting]);

  return (
    <>
      <ConfirmModal
        isOpen={pendingDeleteIndex !== null}
        title="히스토리 삭제"
        message="이 항목을 히스토리에서 삭제할까요?"
        confirmText={isDeleting ? "삭제 중..." : "삭제"}
        cancelText="취소"
        confirmDisabled={isDeleting}
        onConfirm={() => {
          if (pendingDeleteIndex !== null) {
            onRemoveItem?.(pendingDeleteIndex);
            setDeleteRequested(true);
          }
        }}
        onCancel={() => {
          setPendingDeleteIndex(null);
          setDeleteRequested(false);
        }}
      />
      {/* 우측 슬라이드 패널. 열림·닫힘 시 translateX 전환. 전환 애니메이션 적용 여부는 globals.css의 data-allow-transition 정책을 따름. */}
      <div
        data-allow-transition
        className="fixed right-0 z-50 w-full max-w-[280px] border-l border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 top-[81px] bottom-[4.5rem] min-[900px]:bottom-0"
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
          {(fetchError ?? deleteError) && (
            <div className="shrink-0 border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
              <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 py-2 pl-2 pr-2 dark:border-amber-800 dark:bg-amber-950/40">
                <span className="mt-1 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                    {fetchError ? "불러오기 실패" : "삭제 실패"}
                  </p>
                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-300 break-words">
                    {fetchError ?? deleteError}
                  </p>
                  <div className="mt-2">
                    {fetchError && onRetryFetch ? (
                      <button
                        type="button"
                        onClick={onRetryFetch}
                        className="text-xs font-medium text-amber-700 underline hover:no-underline dark:text-amber-300"
                      >
                        다시 시도
                      </button>
                    ) : (
                      deleteError &&
                      onDismissDeleteError && (
                        <button
                          type="button"
                          onClick={onDismissDeleteError}
                          className="text-xs font-medium text-amber-700 underline hover:no-underline dark:text-amber-300"
                        >
                          닫기
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
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
                      key={item.id ?? `${item.createdAt}-${index}`}
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-600 dark:hover:text-zinc-200"
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
