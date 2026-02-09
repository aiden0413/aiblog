"use client";

import { useState } from "react";
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
}

function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function ResultSection({ result, isPending = false }: ResultSectionProps) {
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
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
    <section className="flex-1 min-w-0 min-h-0 flex flex-col bg-zinc-50 dark:bg-zinc-950 relative md:h-full max-h-[calc(100vh-81px-120px)] md:max-h-none">
      {showCopiedToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100">
          복사되었습니다
        </div>
      )}
      <div className="p-6 flex-1 min-h-0 overflow-y-auto">
      {isPending ? (
        <div className="h-full flex flex-col items-center justify-center gap-4">
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-500 dark:border-zinc-700 dark:border-t-indigo-500"
            aria-label="로딩 중"
          />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">블로그 글을 생성하고 있습니다...</p>
        </div>
      ) : result ? (
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 shrink-0">
            생성된 블로그 글
          </h2>

          <div className="space-y-4 shrink-0">
            <div className="flex items-end gap-2">
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  주제
                </label>
                <input
                  type="text"
                  readOnly
                  value={result.title}
                  className="h-10 w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none cursor-default dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <Button
                text="주제 복사"
                onClick={() => handleCopy(result.title)}
                className="shrink-0"
              />
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  seo메타
                </label>
                <input
                  type="text"
                  readOnly
                  value={result.metaDescription || ""}
                  placeholder="-"
                  className="h-10 w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 outline-none cursor-default dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                />
              </div>
              <Button
                text="seo메타 복사"
                onClick={() => handleCopy(result.metaDescription)}
                className="shrink-0"
              />
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  해시태그
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    result.hashtags.length > 0
                      ? result.hashtags.map((tag) => `#${tag}`).join(" ")
                      : ""
                  }
                  placeholder="-"
                  className="h-10 w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-blue-600 outline-none cursor-default dark:border-zinc-600 dark:bg-zinc-800 dark:text-blue-400"
                />
              </div>
              <Button
                text="해시태그 복사"
                onClick={() =>
                  handleCopy(result.hashtags.map((tag) => `#${tag}`).join(" "))
                }
                className="shrink-0"
              />
            </div>
          </div>

          <div className="min-h-[400px] flex flex-col min-w-0">
            <div className="mb-2 shrink-0">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                내용
              </label>
            </div>
            <div className="flex-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
              <MarkdownEditor
                text={result.content}
                editable={true}
                height="600px"
                minHeight="400px"
              />
            </div>
            <div className="flex gap-2 shrink-0 pt-2">
              <Button text="내용 복사" onClick={() => handleCopy(result.content)} />
              <Button
                text="MD 다운로드"
                onClick={() => handleMdDownload(result.content, result.title)}
              />
              <Button
                text="HTML 다운로드"
                onClick={() =>
                  handleHtmlDownload(
                    result.content,
                    result.title,
                    result.metaDescription
                  )
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">
          주제와 키워드를 입력한 뒤 생성 버튼을 눌러주세요.
        </div>
      )}
      </div>
    </section>
  );
}
