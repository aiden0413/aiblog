"use client";

import { FormEvent, useState } from "react";
import type { TemplateType } from "@/backend/applications/prompt/dtos/PromptRequestDto";
import { TextInput } from "../components/commons/TextInput";
import { Dropdown } from "../components/commons/Dropdown";
import { Button } from "../components/commons/Button";
import { MarkdownEditor } from "../components/commons/MarkdownEditor";

interface GenerateBlogResult {
  content: string;
}

const TEMPLATE_OPTIONS: { value: TemplateType; label: string }[] = [
  { value: "튜토리얼", label: "튜토리얼" },
  { value: "TIL", label: "TIL" },
  { value: "트러블슈팅", label: "트러블슈팅" },
];

export default function TestPage() {
  const [topic, setTopic] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [templateType, setTemplateType] = useState<TemplateType>("튜토리얼");
  const [includeCode, setIncludeCode] = useState(false);
  const [result, setResult] = useState<GenerateBlogResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          keywords,
          templateType,
          includeCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "요청 실패");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">블로그 글 생성 API 테스트</h1>
      <p className="mt-2 text-zinc-600 mb-8">
        제목, 키워드, 타입, 코드 포함 여부를 입력 후 API를 호출해 블로그 글을 생성하세요.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput
          id="topic"
          label="제목"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="예: Next.js App Router 사용법"
          required
        />

        <TextInput
          id="keywords"
          label="키워드 (쉼표로 구분)"
          type="text"
          value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
          placeholder="예: Next.js, React, 라우팅"
        />

        <Dropdown
          id="templateType"
          label="글 템플릿 유형"
          options={TEMPLATE_OPTIONS}
          value={templateType}
          onChange={(e) => setTemplateType(e.target.value as TemplateType)}
        />

        <div className="flex items-center gap-2">
          <input
            id="includeCode"
            type="checkbox"
            checked={includeCode}
            onChange={(e) => setIncludeCode(e.target.checked)}
            className="h-4 w-4 rounded border-indigo-500 text-indigo-500 focus:ring-indigo-500"
          />
          <label htmlFor="includeCode" className="text-sm font-medium text-black">
            코드 포함
          </label>
        </div>

        <Button
          text={loading ? "생성 중..." : "블로그 글 생성"}
          type="submit"
          disabled={loading}
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
