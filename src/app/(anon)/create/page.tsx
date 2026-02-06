"use client";

import { FormEvent, useState } from "react";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import { useGenerateBlog } from "@/hooks/useGenerateBlog";
import { InputSection } from "./components/InputSection";
import { ResultSection } from "./components/ResultSection";

export default function CreatePage() {
  const [topic, setTopic] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [style, setStyle] = useState<StyleType>("tutorial");

  const { mutate, data: result, error, isPending } = useGenerateBlog();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    mutate({
      topic: topic.trim(),
      keywords,
      style,
    });
  };

  return (
    <main className="min-h-[calc(100vh-81px)] flex">
      {/* 왼쪽: 입력 영역 */}
      <aside className="w-80 shrink-0 border-r border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 flex flex-col">
        <InputSection
          topic={topic}
          onTopicChange={setTopic}
          keywordsInput={keywordsInput}
          onKeywordsChange={setKeywordsInput}
          style={style}
          onStyleChange={setStyle}
          onSubmit={handleSubmit}
          isPending={isPending}
        />

        {error && (
          <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            <strong>오류</strong>: {error}
          </div>
        )}
      </aside>

      {/* 오른쪽: 결과 영역 */}
      <ResultSection result={result} isPending={isPending} />
    </main>
  );
}
