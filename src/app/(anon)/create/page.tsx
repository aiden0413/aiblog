"use client";

import { FormEvent, useState, useEffect } from "react";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";
import { useGenerateBlog } from "@/hooks/useGenerateBlog";
import { useBlogHistory } from "@/hooks/useBlogHistory";
import { useAuth } from "@/lib/AuthProvider";
import { addHistoryItem, type BlogHistoryItem } from "@/lib/blogHistory";
import type { InputSectionProps } from "./components/InputSection";
import { InputSection } from "./components/InputSection";
import { ResultSection } from "./components/ResultSection";
import { HistoryPanel } from "./components/HistoryPanel";
import { Button } from "../components/commons/Button";
import { MdHistory } from "react-icons/md";

const MOBILE_FORM_ID = "create-blog-form-mobile";

function HistoryToggleButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label="히스토리"
    >
      <MdHistory className="h-5 w-5" />
    </button>
  );
}

export default function CreatePage() {
  const { user } = useAuth();
  const {
    historyItems,
    refetch: refetchHistory,
    removeItem: removeHistoryItem,
    isDeleting: isHistoryDeleting,
    fetchError: historyFetchError,
    deleteError: historyDeleteError,
    clearDeleteError: clearHistoryDeleteError,
  } = useBlogHistory(user?.id ?? null);

  const [topic, setTopic] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [style, setStyle] = useState<StyleType>("tutorial");
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    refetchHistory();
  }, [refetchHistory]);
  /** 히스토리 목록에서 선택된 항목의 생성 결과. ResultSection에 표시됨. */
  const [selectedHistoryResult, setSelectedHistoryResult] = useState<
    GenerateResponseDto | null
  >(null);
  /** 히스토리 항목 선택 시 ResultSection 스크롤을 상단으로 이동시키기 위한 트리거. 동일 항목 재선택 시에도 증가하여 스크롤 동작 보장. */
  const [scrollToTopTrigger, setScrollToTopTrigger] = useState(0);

  const { mutate, data: result, isPending, error: generateError, reset: resetGenerateError } = useGenerateBlog();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    const syncOffline = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    queueMicrotask(syncOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    setSelectedHistoryResult(null);
    resetGenerateError();

    mutate(
      {
        topic: topic.trim(),
        keywords,
        style,
      },
      {
        onSuccess: (responseData) => {
          if (user) {
            refetchHistory();
          } else {
            addHistoryItem({
              topic: topic.trim(),
              keywords,
              style,
              result: responseData,
            });
            refetchHistory();
          }
        },
      }
    );
    setIsInputOpen(false);
    setIsHistoryOpen(false);
  };

  /** ResultSection에 표시할 데이터. 우선순위: 선택된 히스토리 항목 결과 > 최신 API 응답. */
  const displayResult = selectedHistoryResult ?? result ?? undefined;

  const handleSelectHistoryItem = (item: BlogHistoryItem) => {
    if (item.result) {
      setSelectedHistoryResult(item.result);
      setScrollToTopTrigger((t) => t + 1);
      setIsHistoryOpen(false);
      setIsInputOpen(false);
    }
  };

  const handleRemoveHistoryItem = (index: number) => {
    removeHistoryItem(index);
  };

  const handleHistoryToggle = () => {
    setIsInputOpen(false);
    setIsHistoryOpen((prev) => !prev);
  };

  const inputSectionProps: InputSectionProps = {
    topic,
    onTopicChange: setTopic,
    keywordsInput,
    onKeywordsChange: setKeywordsInput,
    style,
    onStyleChange: setStyle,
    onSubmit: handleSubmit,
    isPending,
  };

  const errorMessage = generateError ?? null;

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col min-[900px]:flex-row relative">
      {/* 데스크톱: 사이드바에 입력 폼 */}
      <aside className="hidden w-80 shrink-0 border-r border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 min-[900px]:flex min-[900px]:flex-col">
        <InputSection {...inputSectionProps} />
      </aside>

      {/* 모바일: 1) 헤더(레이아웃) 2) ResultSection(중앙) 3) 하단 블로그 글 생성 버튼. 결과 영역에 하단 바 높이만큼 padding 적용. */}
      {/* 모바일 입력 패널: InputSection이 열기/닫기 버튼과 입력 폼을 함께 렌더. height 전환으로 열림/닫힘 애니메이션. */}
      <div
        data-allow-transition
        className="fixed left-0 right-0 flex flex-col overflow-hidden bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:bg-zinc-900 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] min-[900px]:hidden z-30"
        style={{
          bottom: "4.5rem",
          height: isInputOpen ? "calc(100dvh - 4.5rem)" : "3rem",
          paddingTop: "env(safe-area-inset-top, 0px)",
          transition: "height 300ms cubic-bezier(0.32, 0.72, 0, 1)",
          width: "100%",
        }}
      >
        <InputSection
          {...inputSectionProps}
          hideSubmitButton
          formId={MOBILE_FORM_ID}
          isPanelOpen={isInputOpen}
          onPanelOpenChange={setIsInputOpen}
        />
      </div>
      {/* 모바일 하단 고정 바: 블로그 글 생성 버튼 및 히스토리 버튼. 입력 패널과 독립적으로 항상 하단에 고정. */}
      <div
        className="fixed left-0 right-0 bottom-0 z-50 flex items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white dark:bg-zinc-900 min-[900px]:hidden"
      >
        <Button
          text={isPending ? "생성 중..." : "블로그 글 생성"}
          type="submit"
          form={MOBILE_FORM_ID}
          disabled={isPending}
          className="flex-1 min-w-0"
        />
        <HistoryToggleButton
          onClick={handleHistoryToggle}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 focus:ring-2 focus:ring-purple-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white dark:focus:ring-purple-600"
        />
      </div>

      <HistoryToggleButton
        onClick={handleHistoryToggle}
        className={`fixed right-4 z-30 hidden min-[900px]:inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 shadow-sm outline-none hover:bg-zinc-50 hover:text-zinc-900 focus:ring-2 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white dark:focus:ring-purple-600 ${isOffline ? "top-36" : "top-24"}`}
      />

      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onSelectItem={handleSelectHistoryItem}
        onRemoveItem={handleRemoveHistoryItem}
        isDeleting={isHistoryDeleting}
        fetchError={historyFetchError}
        onRetryFetch={refetchHistory}
        deleteError={historyDeleteError}
        onDismissDeleteError={clearHistoryDeleteError}
      />

      {/* 결과 표시 영역(모바일에서 헤더·본문·하단버튼 3구역의 중앙). 히스토리 패널 열림 시 배경 오버레이 표시. */}
      <div className="relative flex-1 min-w-0 min-h-0 flex flex-col">
        {isHistoryOpen && (
          <button
            type="button"
            onClick={() => setIsHistoryOpen(false)}
            className="absolute top-0 left-0 right-0 bottom-[4.5rem] min-[900px]:bottom-0 z-40 bg-black/30"
            aria-label="히스토리 패널 닫기"
          />
        )}
        <ResultSection
          key={
            displayResult
              ? `${displayResult.title}-${displayResult.content.length}`
              : "empty"
          }
          result={displayResult}
          isPending={isPending}
          errorMessage={errorMessage}
          scrollToTopTrigger={scrollToTopTrigger}
          isOffline={isOffline}
        />
      </div>
    </main>
  );
}
