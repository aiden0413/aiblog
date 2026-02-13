"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GenerateRequestDto } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";

const BLOG_HISTORY_QUERY_KEY = ["blog-history"];

export function useGenerateBlog() {
  const queryClient = useQueryClient();

  return useMutation<GenerateResponseDto, string, GenerateRequestDto>({
    mutationFn: async (params: GenerateRequestDto) => {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok) {
        throw data.error ?? "요청 실패";
      }

      return data as GenerateResponseDto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_HISTORY_QUERY_KEY });
    },
  });
}
