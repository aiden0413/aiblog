"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import { TextInput } from "../components/commons/TextInput";
import { Button } from "../components/commons/Button";
import { useGenerateBlog } from "@/hooks/useGenerateBlog";

const MarkdownEditor = dynamic(
  () =>
    import("../components/commons/MarkdownEditor").then((mod) => ({
      default: mod.MarkdownEditor,
    })),
  { ssr: false }
);

const STYLE_OPTIONS: { value: StyleType; label: string }[] = [
  { value: "tutorial", label: "튜토리얼" },
  { value: "til", label: "TIL" },
  { value: "troubleshooting", label: "트러블슈팅" },
];

export default function TestPage() {
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
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">블로그 글 생성 API 테스트</h1>
      <p className="mt-2 text-zinc-600 mb-8">
        주제, 키워드, 글 스타일을 입력 후 API를 호출해 블로그 글을 생성하세요.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput
          id="topic"
          label="블로그 주제"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="예: React useState 훅 사용법"
          required
        />

        <TextInput
          id="keywords"
          label="키워드 (쉼표로 구분)"
          type="text"
          value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
          placeholder="예: React, Hooks, 상태관리"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700">글 스타일</label>
          <div className="flex gap-6 w-full">
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStyle(opt.value)}
                className={`flex-1 px-4 py-3 rounded-md text-sm font-medium ${
                  style === opt.value
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          text={isPending ? "생성 중..." : "블로그 글 생성"}
          type="submit"
          disabled={isPending}
        />
      </form>

      {error && (
        <div className="mt-8 rounded border border-red-200 bg-red-50 p-4 text-red-700">
          <strong>오류</strong>: {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <h2 className="text-lg font-semibold text-zinc-800">생성된 블로그 글</h2>
          <div className="space-y-2">
            <p className="text-xl font-medium text-zinc-900">{result.title}</p>
            {result.metaDescription && (
              <p className="text-sm text-zinc-600">{result.metaDescription}</p>
            )}
            {result.hashtags.length > 0 && (
              <p className="text-sm text-blue-600">
                {result.hashtags.map((tag) => `#${tag}`).join(" ")}
              </p>
            )}
          </div>
          <MarkdownEditor
            text={result.content}
            editable={true}
            height="600px"
            minHeight="400px"
          />
        </div>
      )}
    </main>
  );
}
