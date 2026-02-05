"use client";

import { useMutation } from "@tanstack/react-query";
import type { GenerateRequestDto } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";

export function useGenerateBlog() {
  return useMutation<GenerateResponseDto, string, GenerateRequestDto>({
    mutationFn: async (params: GenerateRequestDto) => {
      const res = await fetch("/api/generate", {
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
