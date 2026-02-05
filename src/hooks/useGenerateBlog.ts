"use client";

import { useMutation } from "@tanstack/react-query";
import type { PromptRequestDto } from "@/backend/applications/prompt/dtos/PromptRequestDto";
import type { OpenAIGenerateResult } from "@/backend/domain/entities/OpenAIGenerateResult";

export function useGenerateBlog() {
  return useMutation<OpenAIGenerateResult, string, PromptRequestDto>({
    mutationFn: async (params: PromptRequestDto) => {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok) {
        throw data.error ?? "요청 실패";
      }

      return data;
    },
  });
}
