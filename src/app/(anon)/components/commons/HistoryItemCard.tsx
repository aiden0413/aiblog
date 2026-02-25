"use client";

import type { BlogHistoryItem } from "@/lib/blogHistory";
import { STYLE_LABELS } from "@/lib/blogHistory";
import { HiOutlineTrash } from "react-icons/hi";

export interface HistoryItemCardProps {
  item: BlogHistoryItem;
  index: number;
  displayDate: string;
  onSelect?: (item: BlogHistoryItem) => void;
  onDelete: (index: number) => void;
  /** 선택된 항목 강조 (히스토리 리스트용) */
  isActive?: boolean;
  /** 클릭 가능 여부 (result 있으면 true, 패널에서만 사용) */
  clickable?: boolean;
}

export function HistoryItemCard({
  item,
  index,
  displayDate,
  onSelect,
  onDelete,
  isActive = false,
  clickable = true,
}: HistoryItemCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && onSelect && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect(item);
    }
  };

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => onSelect?.(item) : undefined}
      onKeyDown={handleKeyDown}
      className={`select-none relative rounded-lg border p-3 pr-10 ${
        isActive
          ? "border-purple-500 bg-purple-50 dark:border-purple-600 dark:bg-purple-950/30"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 " +
            (clickable
              ? "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700"
              : "cursor-default opacity-75")
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
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
        <span>{displayDate}</span>
      </div>
    </div>
  );
}
