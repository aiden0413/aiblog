"use client";

import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { useBlogHistory } from "@/hooks/useBlogHistory";
import type { BlogHistoryItem } from "@/lib/blogHistory";
import type { HistorySortOption, HistoryStyleFilter } from "./types";
import { HistoryPageDesktop } from "./HistoryPageDesktop";
import { HistoryPageMobile } from "./HistoryPageMobile";

function filterBySearch(items: BlogHistoryItem[], query: string): BlogHistoryItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.topic.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

function filterByStyle(items: BlogHistoryItem[], styleFilter: HistoryStyleFilter): BlogHistoryItem[] {
  if (styleFilter === "all") return items;
  return items.filter((item) => item.style === styleFilter);
}

function compareItems(
  a: BlogHistoryItem,
  b: BlogHistoryItem,
  option: HistorySortOption
): number {
  switch (option) {
    case "dateDesc":
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    case "dateAsc":
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    case "topicAsc":
      return a.topic.localeCompare(b.topic);
    case "topicDesc":
      return b.topic.localeCompare(a.topic);
    default:
      return 0;
  }
}

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    historyItems,
    refetch,
    removeItem,
    isLoading,
    fetchError,
    deleteError,
    clearDeleteError,
  } = useBlogHistory(user?.id ?? null, authLoading);

  const [selectedItem, setSelectedItem] = useState<BlogHistoryItem | null>(null);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<HistorySortOption>("dateDesc");
  const [styleFilter, setStyleFilter] = useState<HistoryStyleFilter>("all");
  const [isMobileListExpanded, setMobileListExpanded] = useState(true);

  const { displayItems, displayOriginalIndices } = useMemo(() => {
    const byStyle = filterByStyle(historyItems, styleFilter);
    const withIndex = byStyle
      .map((item) => {
        const origIdx = historyItems.findIndex(
          (h) => (h.id != null && h.id === item.id) || (h.createdAt === item.createdAt && h.topic === item.topic)
        );
        return { item, origIdx: origIdx >= 0 ? origIdx : 0 };
      })
      .filter(({ item }) => filterBySearch([item], searchQuery).length > 0);
    withIndex.sort((a, b) => compareItems(a.item, b.item, sortOption));
    return {
      displayItems: withIndex.map((x) => x.item),
      displayOriginalIndices: withIndex.map((x) => x.origIdx),
    };
  }, [historyItems, searchQuery, sortOption, styleFilter]);

  const handleRequestDelete = useCallback(
    (listIndex: number) => {
      const originalIndex = displayOriginalIndices[listIndex];
      setPendingDeleteIndex(originalIndex);
    },
    [displayOriginalIndices]
  );

  const handleConfirmDelete = () => {
    if (pendingDeleteIndex === null) return;
    const itemToRemove = historyItems[pendingDeleteIndex];
    const promise = removeItem(pendingDeleteIndex);
    setDeleteRequested(true);
    promise?.finally(() => {
      setDeleteRequested(false);
      setPendingDeleteIndex(null);
      if (selectedItem && itemToRemove?.id === selectedItem?.id) {
        setSelectedItem(null);
      }
    });
  };

  const handleSelectItem = useCallback((item: BlogHistoryItem | null) => {
    setSelectedItem(item);
    setMobileListExpanded(false); // 모바일: 선택 시 리스트 패널 닫기
  }, []);

  const commonProps = {
    historyItems: displayItems,
    isLoading,
    fetchError,
    deleteError,
    refetch,
    clearDeleteError,
    selectedItem,
    onSelectItem: handleSelectItem,
    pendingDeleteIndex,
    onRequestDelete: handleRequestDelete,
    deleteRequested,
    onConfirmDelete: handleConfirmDelete,
    onCancelDelete: () => {
      setPendingDeleteIndex(null);
      setDeleteRequested(false);
    },
    searchQuery,
    onSearchChange: setSearchQuery,
    sortOption,
    onSortChange: setSortOption,
    styleFilter,
    onStyleFilterChange: setStyleFilter,
    isMobileListExpanded,
    onMobileListExpandToggle: () => setMobileListExpanded((prev) => !prev),
  };

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-1 min-[900px]:hidden">
        <HistoryPageMobile {...commonProps} />
      </div>
      <div className="hidden min-h-0 w-full flex-1 min-[900px]:flex">
        <HistoryPageDesktop {...commonProps} />
      </div>
    </>
  );
}
