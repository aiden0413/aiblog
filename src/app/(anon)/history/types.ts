import type { BlogHistoryItem } from "@/lib/blogHistory";

export type HistorySortOption = "dateDesc" | "dateAsc" | "topicAsc" | "topicDesc";

export interface HistoryPageProps {
  historyItems: BlogHistoryItem[];
  isLoading: boolean;
  fetchError: string | null;
  deleteError: string | null;
  refetch: () => void;
  clearDeleteError: () => void;
  selectedItem: BlogHistoryItem | null;
  onSelectItem: (item: BlogHistoryItem) => void;
  pendingDeleteIndex: number | null;
  onRequestDelete: (index: number) => void;
  deleteRequested: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  /** 검색어. 비어 있으면 전체 표시 */
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sortOption?: HistorySortOption;
  onSortChange?: (option: HistorySortOption) => void;
}
