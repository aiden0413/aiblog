"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { STYLE_LABELS } from "@/lib/blogHistory";
import { HiOutlineTrash } from "react-icons/hi";
import { BsSortDown } from "react-icons/bs";
import type { HistoryPageProps, HistorySortOption } from "../types";

const SORT_OPTIONS: { value: HistorySortOption; label: string }[] = [
  { value: "dateDesc", label: "최신순" },
  { value: "dateAsc", label: "오래된순" },
  { value: "topicAsc", label: "주제 가나다순" },
  { value: "topicDesc", label: "주제 가나다역순" },
];

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export interface HistoryListSectionProps extends HistoryPageProps {
  asideClassName: string;
}

export function HistoryListSection({
  historyItems,
  isLoading,
  fetchError,
  deleteError,
  refetch,
  clearDeleteError,
  selectedItem,
  onSelectItem,
  onRequestDelete,
  asideClassName,
  searchQuery = "",
  onSearchChange,
  sortOption = "dateDesc",
  onSortChange,
}: HistoryListSectionProps) {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className={asideClassName}>
      <div className="shrink-0 flex items-center justify-between gap-3 border-b border-zinc-300 px-4 py-2.5 dark:border-zinc-600">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          목록
        </span>
        <Link
          href="/create"
          className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          글 생성
        </Link>
      </div>

      <div className="shrink-0 flex items-center gap-2 border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="주제·키워드 검색"
          className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500"
          aria-label="히스토리 검색"
        />
        <div className="relative shrink-0" ref={sortDropdownRef}>
          <button
            type="button"
            onClick={() => setSortDropdownOpen((prev) => !prev)}
            title={SORT_OPTIONS.find((o) => o.value === sortOption)?.label ?? "정렬"}
            className="rounded-md border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
            aria-label="정렬"
            aria-expanded={sortDropdownOpen}
          >
            <BsSortDown className="h-5 w-5" />
          </button>
          {sortDropdownOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-1 min-w-[8rem] rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
              role="listbox"
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={sortOption === opt.value}
                  onClick={() => {
                    onSortChange?.(opt.value);
                    setSortDropdownOpen(false);
                  }}
                  className={`flex w-full items-center px-3 py-1.5 text-left text-xs ${
                    sortOption === opt.value
                      ? "bg-purple-50 font-medium text-purple-700 dark:bg-purple-950/30 dark:text-purple-300"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {(fetchError ?? deleteError) && (
        <div className="shrink-0 border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            {fetchError ?? deleteError}
            <div className="mt-2 flex gap-2">
              {fetchError && (
                <button type="button" onClick={refetch} className="font-medium underline">
                  다시 시도
                </button>
              )}
              {deleteError && (
                <button type="button" onClick={clearDeleteError} className="font-medium underline">
                  닫기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-zinc-200 animate-pulse dark:bg-zinc-700"
              />
            ))}
          </div>
        ) : historyItems.length === 0 ? (
          <div className="flex min-h-full flex-1 items-center justify-center">
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              생성한 글이 없습니다.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {historyItems.map((item, index) => {
              const isSelected =
                selectedItem?.id !== undefined && item.id === selectedItem.id;
              const isSelectedLocal =
                selectedItem === item ||
                (selectedItem?.createdAt === item.createdAt &&
                  selectedItem?.topic === item.topic);
              const active = isSelected || (selectedItem != null && isSelectedLocal);
              return (
                <li key={item.id ?? `${item.createdAt}-${index}`}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectItem(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectItem(item);
                      }
                    }}
                    className={`group relative rounded-lg border p-3 pr-10 ${
                      active
                        ? "border-purple-500 bg-purple-50 dark:border-purple-600 dark:bg-purple-950/30"
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestDelete(index);
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
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="shrink-0 border-t border-zinc-300 dark:border-zinc-600" aria-hidden />
    </aside>
  );
}
