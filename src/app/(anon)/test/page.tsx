"use client";

import { Component, FormEvent } from "react";
import type { TemplateType } from "@/backend/applications/prompt/dtos/PromptRequestDto";

interface CreatePromptResult {
  systemContent: string;
  userContent: string;
}

interface TestPageState {
  topic: string;
  keywordsInput: string;
  templateType: TemplateType;
  includeCode: boolean;
  result: CreatePromptResult | null;
  error: string | null;
  loading: boolean;
}

const TEMPLATE_OPTIONS: { value: TemplateType; label: string }[] = [
  { value: "튜토리얼", label: "튜토리얼" },
  { value: "TIL", label: "TIL" },
  { value: "트러블슈팅", label: "트러블슈팅" },
];

export default class TestPage extends Component<object, TestPageState> {
  state: TestPageState = {
    topic: "",
    keywordsInput: "",
    templateType: "튜토리얼",
    includeCode: false,
    result: null,
    error: null,
    loading: false,
  };

  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { topic, keywordsInput, templateType, includeCode } = this.state;

    this.setState({ error: null, result: null, loading: true });

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
        this.setState({ error: data.error ?? "요청 실패", loading: false });
        return;
      }

      this.setState({ result: data, loading: false });
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : "요청 중 오류 발생",
        loading: false,
      });
    }
  };

  render() {
    const { topic, keywordsInput, templateType, includeCode, result, error, loading } =
      this.state;

    return (
      <main className="min-h-screen p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">프롬프트 API 테스트</h1>
        <p className="mt-2 text-zinc-600 mb-8">
          제목, 키워드, 타입, 코드 포함 여부를 입력 후 API를 호출해 결과를 확인하세요.
        </p>

        <form onSubmit={this.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-zinc-700 mb-1">
              제목
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => this.setState({ topic: e.target.value })}
              placeholder="예: Next.js App Router 사용법"
              className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-zinc-700 mb-1">
              키워드 (쉼표로 구분)
            </label>
            <input
              id="keywords"
              type="text"
              value={keywordsInput}
              onChange={(e) => this.setState({ keywordsInput: e.target.value })}
              placeholder="예: Next.js, React, 라우팅"
              className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="templateType" className="block text-sm font-medium text-zinc-700 mb-1">
              글 템플릿 유형
            </label>
            <select
              id="templateType"
              value={templateType}
              onChange={(e) => this.setState({ templateType: e.target.value as TemplateType })}
              className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {TEMPLATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="includeCode"
              type="checkbox"
              checked={includeCode}
              onChange={(e) => this.setState({ includeCode: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="includeCode" className="text-sm font-medium text-zinc-700">
              코드 포함
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "요청 중..." : "API 호출"}
          </button>
        </form>

        {error && (
          <div className="mt-8 rounded border border-red-200 bg-red-50 p-4 text-red-700">
            <strong>오류</strong>: {error}
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-800">결과</h2>

            <div>
              <h3 className="text-sm font-medium text-zinc-600 mb-2">systemContent</h3>
              <pre className="rounded border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800 whitespace-pre-wrap overflow-x-auto">
                {result.systemContent}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-600 mb-2">userContent</h3>
              <pre className="rounded border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800 whitespace-pre-wrap overflow-x-auto">
                {result.userContent}
              </pre>
            </div>
          </div>
        )}
      </main>
    );
  }
}
