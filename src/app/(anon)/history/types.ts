import type { BlogHistoryItem } from "@/lib/blogHistory";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";

export type HistorySortOption = "dateDesc" | "dateAsc" | "topicAsc" | "topicDesc";

/** 글 스타일 필터: 전체 또는 튜토리얼/TIL/트러블슈팅 중 하나 */
export type HistoryStyleFilter = "all" | StyleType;

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
  /** 글 스타일 필터. 'all'이면 전체, 그 외에는 해당 스타일만 */
  styleFilter?: HistoryStyleFilter;
  onStyleFilterChange?: (filter: HistoryStyleFilter) => void;
  /** 모바일: 리스트 섹션 펼침 여부 (접기/펼치기용) */
  isMobileListExpanded?: boolean;
  onMobileListExpandToggle?: () => void;
}
