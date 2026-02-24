"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

export function useBlogHistory(userId: string | null, authLoading: boolean) {
  const queryClient = useQueryClient();
  const [localItems, setLocalItems] = useState<BlogHistoryItem[]>([]);
  const [localLoaded, setLocalLoaded] = useState(false);

  // 로그인 상태에서는 로컬 스토리지 미사용. 비로그인 확정 후에만 로컬 스토리지 읽기 (깜빡임 방지)
  useEffect(() => {
    if (authLoading) {
      queueMicrotask(() => setLocalLoaded(false));
      return;
    }
    if (!userId) {
      queueMicrotask(() => {
        setLocalItems(getHistory());
        setLocalLoaded(true);
      });
    } else {
      queueMicrotask(() => setLocalLoaded(false));
    }
  }, [userId, authLoading]);

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

  /** 로그인 시 DB(API) 값, 비로그인 시 로컬 스토리지 값. auth 로딩 중에는 로컬 미사용(빈 배열) */
  const historyItems = useMemo(
    () => (authLoading ? [] : userId ? apiItems : localItems),
    [authLoading, userId, apiItems, localItems]
  );
  /** auth 로딩 중이거나, 로그인 시 API 로딩 중, 비로그인 시 로컬 읽기 전까지 → 스켈레톤 */
  const isLoading = Boolean(authLoading || (userId ? isLoadingApi : !localLoaded));

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

  const refetch = useCallback((): Promise<void> => {
    if (userId) {
      return refetchApi().then(() => {});
    }
    setLocalItems(getHistory());
    return Promise.resolve();
  }, [userId, refetchApi]);

  const removeItem = useCallback(
    (index: number): Promise<void> => {
      const item = historyItems[index];
      if (userId && item?.id) {
        return deleteMutation
          .mutateAsync(item.id)
          .then(() => refetch());
      }
      if (!userId) {
        removeHistoryItemAtIndex(index);
        setLocalItems(getHistory());
        return new Promise((resolve) => setTimeout(resolve, 0));
      }
      return Promise.resolve();
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
