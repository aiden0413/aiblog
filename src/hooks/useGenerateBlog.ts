"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GenerateRequestDto } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";

const BLOG_HISTORY_QUERY_KEY = ["blog-history"];

export function useGenerateBlog() {
  const queryClient = useQueryClient();

  return useMutation<GenerateResponseDto, string, GenerateRequestDto>({
    mutationFn: async (params: GenerateRequestDto) => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        throw "인터넷에 연결되어 있지 않습니다. 네트워크를 확인한 뒤 다시 시도해주세요.";
      }

      let res: Response;
      try {
        res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(params),
        });
      } catch (err) {
        const isNetworkError =
          err instanceof TypeError &&
          (err.message === "Failed to fetch" || err.message.includes("network"));
        if (isNetworkError) {
          throw "인터넷에 연결되어 있지 않거나 서버에 연결할 수 없습니다. 네트워크를 확인한 뒤 다시 시도해주세요.";
        }
        throw "요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      }

      const data = await res.json();

      if (!res.ok) {
        const message =
          data && typeof data === "object" && "error" in data && typeof data.error === "string"
            ? data.error
            : "요청에 실패했습니다. 잠시 후 다시 시도해주세요.";
        throw message;
      }

      return data as GenerateResponseDto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_HISTORY_QUERY_KEY });
    },
  });
}
