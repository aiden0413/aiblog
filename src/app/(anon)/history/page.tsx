"use client";

import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { useBlogHistory } from "@/hooks/useBlogHistory";
import type { BlogHistoryItem } from "@/lib/blogHistory";
import type { HistorySortOption } from "./types";
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
  const { user } = useAuth();
  const {
    historyItems,
    refetch,
    removeItem,
    isLoading,
    fetchError,
    deleteError,
    clearDeleteError,
  } = useBlogHistory(user?.id ?? null);

  const [selectedItem, setSelectedItem] = useState<BlogHistoryItem | null>(null);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<HistorySortOption>("dateDesc");

  const { displayItems, displayOriginalIndices } = useMemo(() => {
    const withIndex = historyItems
      .map((item, origIdx) => ({ item, origIdx }))
      .filter(({ item }) => filterBySearch([item], searchQuery).length > 0);
    withIndex.sort((a, b) => compareItems(a.item, b.item, sortOption));
    return {
      displayItems: withIndex.map((x) => x.item),
      displayOriginalIndices: withIndex.map((x) => x.origIdx),
    };
  }, [historyItems, searchQuery, sortOption]);

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

  const commonProps = {
    historyItems: displayItems,
    isLoading,
    fetchError,
    deleteError,
    refetch,
    clearDeleteError,
    selectedItem,
    onSelectItem: setSelectedItem,
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
