"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BlogHistoryItem } from "@/lib/blogHistory";
import { getHistory, removeHistoryItemAtIndex } from "@/lib/blogHistory";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";

const HISTORY_QUERY_KEY = ["blog-history"];

function historyDtoToItem(
  dto: {
    id: string;
    topic: string;
    keywords: string[];
    style: StyleType;
    result: GenerateResponseDto;
    createdAt: string;
  }
): BlogHistoryItem {
  return {
    id: dto.id,
    topic: dto.topic,
    keywords: dto.keywords,
    style: dto.style,
    createdAt: dto.createdAt,
    result: dto.result,
  };
}

async function fetchHistory(): Promise<BlogHistoryItem[]> {
  const res = await fetch("/api/history", { credentials: "include" });
  if (!res.ok) {
    if (res.status === 401) return [];
    throw new Error("히스토리를 불러올 수 없습니다.");
  }
  const data = await res.json();
  const items = Array.isArray(data?.items) ? data.items : [];
  return items.map((row: Record<string, unknown>) =>
    historyDtoToItem({
      id: String(row.id),
      topic: String(row.topic),
      keywords: Array.isArray(row.keywords) ? (row.keywords as string[]) : [],
      style: (row.style as StyleType) ?? "tutorial",
      result: row.result as GenerateResponseDto,
      createdAt: String(row.createdAt),
    })
  );
}

async function deleteHistory(id: string): Promise<void> {
  const res = await fetch(`/api/history/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "삭제에 실패했습니다.");
  }
}

export function useBlogHistory(userId: string | null) {
  const queryClient = useQueryClient();
  const [localItems, setLocalItems] = useState<BlogHistoryItem[]>([]);

  // 비로그인: 마운트 후에만 로컬 스토리지 읽기 (서버와 초기 HTML을 맞춰 hydration 에러 방지)
  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => setLocalItems(getHistory()));
    }
  }, [userId]);

  const {
    data: apiItems = [],
    isLoading: isLoadingApi,
    refetch: refetchApi,
  } = useQuery({
    queryKey: [...HISTORY_QUERY_KEY, userId],
    queryFn: fetchHistory,
    enabled: Boolean(userId),
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
    },
  });

  /** 로그인 시 DB(API) 값, 비로그인 시 로컬 스토리지 값 */
  const historyItems = userId ? apiItems : localItems;
  const isLoading = Boolean(userId && isLoadingApi);

  const refetch = useCallback(() => {
    if (userId) {
      void refetchApi();
    } else {
      setLocalItems(getHistory());
    }
  }, [userId, refetchApi]);

  const removeItem = useCallback(
    (index: number) => {
      const item = historyItems[index];
      if (userId && item?.id) {
        deleteMutation.mutate(item.id, { onSuccess: () => refetch() });
      } else if (!userId) {
        removeHistoryItemAtIndex(index);
        setLocalItems(getHistory());
      }
    },
    [userId, historyItems, deleteMutation, refetch]
  );

  return {
    historyItems,
    isLoading,
    refetch,
    removeItem,
    isDeleting: deleteMutation.isPending,
  };
}
