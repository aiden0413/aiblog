"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import { useGenerateBlog } from "@/hooks/useGenerateBlog";
import { InputSection } from "./components/InputSection";

const MarkdownEditor = dynamic(
  () =>
    import("../components/commons/MarkdownEditor").then((mod) => ({
      default: mod.MarkdownEditor,
    })),
  { ssr: false }
);

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
    <main className="min-h-screen flex">
      {/* 왼쪽: 입력 영역 */}
      <aside className="w-80 shrink-0 border-r border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 flex flex-col">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">블로그 글 생성</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          주제, 키워드, 글 스타일을 입력 후 생성 버튼을 누르세요.
        </p>

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
      <section className="flex-1 min-w-0 p-6 bg-zinc-50 dark:bg-zinc-950">
        {result ? (
          <div className="h-full flex flex-col space-y-4">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 shrink-0">
              생성된 블로그 글
            </h2>
            <div className="space-y-2 shrink-0">
              <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100">{result.title}</p>
              {result.metaDescription && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{result.metaDescription}</p>
              )}
              {result.hashtags.length > 0 && (
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {result.hashtags.map((tag) => `#${tag}`).join(" ")}
                </p>
              )}
            </div>
            <div className="flex-1 min-h-[400px] rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
              <MarkdownEditor
                text={result.content}
                editable={true}
                height="600px"
                minHeight="400px"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">
            왼쪽에서 주제와 키워드를 입력한 뒤 생성 버튼을 눌러주세요.
          </div>
        )}
      </section>
    </main>
  );
}
