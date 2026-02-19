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
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error("인터넷에 연결되어 있지 않습니다. 네트워크를 확인한 뒤 다시 시도해주세요.");
  }

  let res: Response;
  try {
    res = await fetch("/api/history", { credentials: "include" });
  } catch (err) {
    const isNetworkError =
      err instanceof TypeError &&
      (err.message === "Failed to fetch" || (err.message as string).includes("network"));
    if (isNetworkError) {
      throw new Error(
        "인터넷에 연결되어 있지 않거나 서버에 연결할 수 없습니다. 네트워크를 확인한 뒤 다시 시도해주세요."
      );
    }
    throw new Error("히스토리를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
  }

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) return [];
    const message =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : "요청에 실패했습니다. 잠시 후 다시 시도해주세요.";
    throw new Error(message);
  }

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
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error("인터넷에 연결되어 있지 않습니다. 네트워크를 확인한 뒤 다시 시도해주세요.");
  }

  let res: Response;
  try {
    res = await fetch(`/api/history/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (err) {
    const isNetworkError =
      err instanceof TypeError &&
      (err.message === "Failed to fetch" || (err.message as string).includes("network"));
    if (isNetworkError) {
      throw new Error(
        "인터넷에 연결되어 있지 않거나 서버에 연결할 수 없습니다. 네트워크를 확인한 뒤 다시 시도해주세요."
      );
    }
    throw new Error("삭제 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }

  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    const message =
      data && typeof data === "object" && "error" in data && typeof (data as { error?: string }).error === "string"
        ? (data as { error: string }).error
        : "요청에 실패했습니다. 잠시 후 다시 시도해주세요.";
    throw new Error(message);
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
    isError: isFetchError,
    error: fetchErrorRaw,
    refetch: refetchApi,
  } = useQuery({
    queryKey: [...HISTORY_QUERY_KEY, userId],
    queryFn: fetchHistory,
    enabled: Boolean(userId),
    staleTime: 30_000,
    retry: false,
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

  const fetchError: string | null =
    isFetchError && fetchErrorRaw
      ? typeof fetchErrorRaw === "string"
        ? fetchErrorRaw
        : fetchErrorRaw instanceof Error
          ? fetchErrorRaw.message
          : "요청에 실패했습니다. 잠시 후 다시 시도해주세요."
      : null;

  const deleteErrorRaw = deleteMutation.error;
  const deleteError: string | null =
    deleteErrorRaw != null
      ? typeof deleteErrorRaw === "string"
        ? deleteErrorRaw
        : deleteErrorRaw instanceof Error
          ? deleteErrorRaw.message
          : "요청에 실패했습니다. 잠시 후 다시 시도해주세요."
      : null;

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
    fetchError,
    refetch,
    removeItem,
    isDeleting: deleteMutation.isPending,
    deleteError,
    clearDeleteError: deleteMutation.reset,
  };
}
