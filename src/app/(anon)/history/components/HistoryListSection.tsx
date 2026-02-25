"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { STYLE_LABELS } from "@/lib/blogHistory";
import { HistoryItemCard } from "../../components/commons/HistoryItemCard";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { BsSortDown } from "react-icons/bs";
import type { HistoryPageProps, HistorySortOption, HistoryStyleFilter } from "../types";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";

const STYLE_FILTER_OPTIONS: { value: HistoryStyleFilter; label: string }[] = [
  { value: "all", label: "전체" },
  ...(["tutorial", "til", "troubleshooting"] as const).map((s) => ({
    value: s as StyleType,
    label: STYLE_LABELS[s],
  })),
];

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
  /** aside에 적용할 인라인 스타일 (모바일 전환 높이 등) */
  asideStyle?: React.CSSProperties;
  /** 모바일: 접기/펼치기 사용 여부 */
  collapsible?: boolean;
  /** collapsible일 때 리스트 펼침 여부 */
  isListExpanded?: boolean;
  onListExpandToggle?: () => void;
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
  asideStyle,
  searchQuery = "",
  onSearchChange,
  sortOption = "dateDesc",
  onSortChange,
  styleFilter = "all",
  onStyleFilterChange,
  collapsible = false,
  isListExpanded = true,
  onListExpandToggle,
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

  const collapsibleBar = collapsible && (
    <div className="shrink-0 bg-white dark:bg-zinc-900">
      <button
        type="button"
        onClick={onListExpandToggle}
        className="flex h-12 w-full items-center justify-center border-0 bg-zinc-100 text-zinc-600 outline-none hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:active:bg-zinc-600"
        aria-expanded={isListExpanded}
        aria-label={isListExpanded ? "목록 접기" : "목록 펼치기"}
      >
        {isListExpanded ? (
          <HiChevronUp className="h-6 w-6 shrink-0" />
        ) : (
          <HiChevronDown className="h-6 w-6 shrink-0" />
        )}
      </button>
    </div>
  );

  return (
    <aside
      className={asideClassName}
      style={asideStyle}
      {...(collapsible ? { "data-allow-transition": true } : {})}
    >
      {collapsible && !isListExpanded && <div className="flex-1 min-h-0" aria-hidden />}
      {(!collapsible || isListExpanded) && (
        <div className="shrink-0 flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-700">
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
      )}

      {(!collapsible || isListExpanded) && (
        <>
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

      <div className="shrink-0 flex flex-wrap gap-1.5 border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
        {STYLE_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStyleFilterChange?.(opt.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              styleFilter === opt.value
                ? "bg-purple-500 text-white dark:bg-purple-600"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
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
                  <HistoryItemCard
                    item={item}
                    index={index}
                    displayDate={formatDate(item.createdAt)}
                    onSelect={onSelectItem}
                    onDelete={onRequestDelete}
                    isActive={active}
                    clickable
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="shrink-0" aria-hidden />
        </>
      )}
      {collapsibleBar}
    </aside>
  );
}
