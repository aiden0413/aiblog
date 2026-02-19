"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { marked } from "marked";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";
import { Button } from "../../components/commons/Button";

function sanitizeFileName(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, "").trim() || "download";
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const MarkdownEditor = dynamic(
  () =>
    import("../../components/commons/MarkdownEditor").then((mod) => ({
      default: mod.MarkdownEditor,
    })),
  { ssr: false }
);

export interface ResultSectionProps {
  result: GenerateResponseDto | undefined;
  isPending?: boolean;
  /** API/네트워크 에러 시 사용자에게 보여줄 메시지. 있으면 에러 UI 표시. */
  errorMessage?: string | null;
  /** 값이 변경될 때마다 결과 영역 스크롤을 상단으로 이동. 동일 항목 재선택 시에도 스크롤 동작 보장. */
  scrollToTopTrigger?: number;
  /** 오프라인 배너 표시 여부. true면 결과 영역 max-height를 줄여 하단 버튼이 잘리지 않게 함. */
  isOffline?: boolean;
}

function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

function ResultSectionSkeleton() {
  return (
    <div className="flex flex-col space-y-4" aria-label="로딩 중">
      <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
      <div className="space-y-4">
        <div>
          <div className="h-4 w-12 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse mb-2" />
          <div className="min-h-10 w-full rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        </div>
        <div>
          <div className="h-4 w-14 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse mb-2" />
          <div className="min-h-10 w-full rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        </div>
        <div>
          <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse mb-2" />
          <div className="min-h-10 w-full rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col min-w-0">
        <div className="h-4 w-14 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse mb-2" />
        <div className="w-full h-[600px] min-w-0 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        <div className="flex gap-2 pt-2">
          <div className="h-10 min-w-[5rem] rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
          <div className="h-10 min-w-[5rem] rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
          <div className="h-10 min-w-[5rem] rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ResultSection({
  result,
  isPending = false,
  errorMessage = null,
  scrollToTopTrigger = 0,
  isOffline = false,
}: ResultSectionProps) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [contentReady, setContentReady] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
      scrollContainerRef.current?.scrollTo({ top: 0 });
    }
  }, [result, scrollToTopTrigger]);

  const handleCopy = async (text: string, label: string) => {
    await copyToClipboard(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const handleMdDownload = (content: string, title: string) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const filename = `${sanitizeFileName(title)}.md`;
    downloadBlob(blob, filename);
  };

  const handleHtmlDownload = (
    content: string,
    title: string,
    metaDescription: string
  ) => {
    const bodyHtml = marked.parse(content, { async: false }) as string;
    const desc = escapeHtml(metaDescription || "");
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${desc}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="article" />
  <title>${escapeHtml(title)}</title>
</head>
<body>
${bodyHtml}
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const filename = `${sanitizeFileName(title)}.html`;
    downloadBlob(blob, filename);
  };

  function escapeHtml(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (ch) => map[ch] ?? ch);
  }

  return (
    <section className="flex-1 min-w-0 min-h-0 flex flex-col overflow-x-hidden bg-zinc-50 dark:bg-zinc-950 relative min-[900px]:h-full max-h-[calc(100dvh-81px-120px)] min-[900px]:max-h-none">
      {isOffline && (
        <div
          className="shrink-0 flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2.5 text-sm font-medium"
          role="alert"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
          <span>인터넷에 연결되어 있지 않습니다. 블로그 생성을 하려면 네트워크를 확인해주세요.</span>
        </div>
      )}
      {copiedLabel !== null && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100">
          {copiedLabel} 복사됨
        </div>
      )}
      <div
        ref={scrollContainerRef}
        className="p-6 flex-1 min-h-0 overflow-x-hidden overflow-y-auto relative"
      >
      {isPending ? (
        <ResultSectionSkeleton />
      ) : errorMessage ? (
        <div className="flex flex-1 min-h-full flex-col items-center justify-center px-6 py-10 text-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4 mb-4" aria-hidden>
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-2">생성에 실패했습니다</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mb-6">{errorMessage}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">입력 내용을 확인한 뒤 다시 시도해주세요.</p>
        </div>
      ) : result ? (
        <>
          <div
            className={`flex flex-col space-y-4 ${contentReady ? "" : "invisible"}`}
            aria-hidden={!contentReady}
          >
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 shrink-0">
            생성된 블로그 글
          </h2>

          <div className="space-y-4 shrink-0">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                <span>주제</span>
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">(클릭 시 복사)</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopy(result.title, "주제")}
                className="min-h-10 w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 text-left outline-none cursor-pointer break-words hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                title="클릭하면 복사됩니다"
                aria-label="주제 복사"
              >
                {result.title}
              </button>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                <span>seo메타</span>
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">(클릭 시 복사)</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopy(result.metaDescription ?? "", "seo메타")}
                className="min-h-10 w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 text-left outline-none cursor-pointer break-words hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                title="클릭하면 복사됩니다"
                aria-label="seo메타 복사"
              >
                {result.metaDescription || "-"}
              </button>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                <span>해시태그</span>
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">(클릭 시 복사)</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  handleCopy(result.hashtags.map((tag) => `#${tag}`).join(" "), "해시태그")
                }
                className="min-h-10 w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-blue-600 text-left outline-none cursor-pointer break-words hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-blue-400 dark:hover:bg-zinc-700"
                title="클릭하면 복사됩니다"
                aria-label="해시태그 복사"
              >
                {result.hashtags.length > 0
                  ? result.hashtags.map((tag) => `#${tag}`).join(" ")
                  : "-"}
              </button>
            </div>
          </div>

          <div className="min-h-[400px] flex flex-col min-w-0">
            <div className="mb-2 shrink-0">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                내용
              </label>
            </div>
            <div className="flex-1 min-w-0 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
              <MarkdownEditor
                text={result.content}
                editable={true}
                height="600px"
                minHeight="400px"
                onReady={() => setContentReady(true)}
              />
            </div>
            <div className="flex gap-2 shrink-0 pt-2">
              <Button
                text="복사"
                onClick={() => handleCopy(result.content, "내용")}
                title="내용 복사"
                style={{ minWidth: "5rem" }}
              />
              <Button
                text="MD"
                onClick={() => handleMdDownload(result.content, result.title)}
                title="MD 파일 다운로드"
                style={{ minWidth: "5rem" }}
              />
              <Button
                text="HTML"
                onClick={() =>
                  handleHtmlDownload(
                    result.content,
                    result.title,
                    result.metaDescription
                  )
                }
                title="HTML 파일 다운로드"
                style={{ minWidth: "5rem" }}
              />
            </div>
          </div>
          </div>
          {!contentReady && (
            <div className="absolute inset-0 p-6 bg-zinc-50 dark:bg-zinc-950 overflow-y-auto">
              <ResultSectionSkeleton />
            </div>
          )}
        </>
      ) : (
        <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">
          주제와 키워드를 입력한 뒤 생성 버튼을 눌러주세요.
        </div>
      )}
      </div>
    </section>
  );
}
