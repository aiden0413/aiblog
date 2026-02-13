import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";

const STORAGE_KEY = "aiblog-history";
const MAX_ITEMS = 50;

export interface BlogHistoryItem {
  /** API에서 온 항목일 때만 존재 (로컬 전용 항목은 없음) */
  id?: string;
  topic: string;
  keywords: string[];
  style: StyleType;
  createdAt: string;
  /** 생성 완료 후 저장된 결과. 존재 시 히스토리 항목 클릭 시 해당 결과를 다시 표시함. */
  result?: GenerateResponseDto;
}

function isStyleType(s: unknown): s is StyleType {
  return s === "tutorial" || s === "til" || s === "troubleshooting";
}

function isResult(r: unknown): r is GenerateResponseDto {
  if (!r || typeof r !== "object") return false;
  const o = r as Record<string, unknown>;
  return (
    typeof o.title === "string" &&
    typeof o.content === "string" &&
    Array.isArray(o.hashtags) &&
    typeof o.metaDescription === "string"
  );
}

export function getHistory(): BlogHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item: unknown) => {
      if (!item || typeof item !== "object") return false;
      const i = item as Record<string, unknown>;
      return (
        typeof i.topic === "string" &&
        Array.isArray(i.keywords) &&
        isStyleType(i.style) &&
        typeof i.createdAt === "string" &&
        (i.result === undefined || isResult(i.result))
      );
    }) as BlogHistoryItem[];
  } catch {
    return [];
  }
}

export function addHistoryItem(
  item: Omit<BlogHistoryItem, "createdAt"> & { result?: GenerateResponseDto }
): void {
  const list = getHistory();
  const newItem: BlogHistoryItem = {
    ...item,
    createdAt: new Date().toISOString(),
  };
  const next = [newItem, ...list].slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* localStorage 할당량 초과 등 저장 실패 시 무시. */
  }
}

export function removeHistoryItemAtIndex(index: number): void {
  const list = getHistory();
  if (index < 0 || index >= list.length) return;
  const next = list.filter((_, i) => i !== index);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* 저장 실패 시 무시. */
  }
}

export const STYLE_LABELS: Record<StyleType, string> = {
  tutorial: "튜토리얼",
  til: "TIL",
  troubleshooting: "트러블슈팅",
};
