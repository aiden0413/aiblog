"use client";

import { FormEvent, useState } from "react";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";
import { useGenerateBlog } from "@/hooks/useGenerateBlog";
import { getHistory, addHistoryItem, removeHistoryItemAtIndex } from "@/lib/blogHistory";
import type { BlogHistoryItem } from "@/lib/blogHistory";
import type { InputSectionProps } from "./components/InputSection";
import { InputSection } from "./components/InputSection";
import { ResultSection } from "./components/ResultSection";
import { HistoryPanel } from "./components/HistoryPanel";
import { Button } from "../components/commons/Button";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { MdHistory } from "react-icons/md";

const MOBILE_FORM_ID = "create-blog-form-mobile";
const MOBILE_CLOSED_HEIGHT = 48;

export default function CreatePage() {
  const [topic, setTopic] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [style, setStyle] = useState<StyleType>("tutorial");
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState(() => getHistory());
  /** 히스토리 목록에서 선택된 항목의 생성 결과. ResultSection에 표시됨. */
  const [selectedHistoryResult, setSelectedHistoryResult] = useState<
    GenerateResponseDto | null
  >(null);
  /** 히스토리 항목 선택 시 ResultSection 스크롤을 상단으로 이동시키기 위한 트리거. 동일 항목 재선택 시에도 증가하여 스크롤 동작 보장. */
  const [scrollToTopTrigger, setScrollToTopTrigger] = useState(0);

  const { mutate, data: result, isPending } = useGenerateBlog();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    setSelectedHistoryResult(null);

    mutate(
      {
        topic: topic.trim(),
        keywords,
        style,
      },
      {
        onSuccess: (responseData) => {
          addHistoryItem({
            topic: topic.trim(),
            keywords,
            style,
            result: responseData,
          });
          setHistoryItems(getHistory());
        },
      }
    );
    setIsInputOpen(false);
  };

  /** ResultSection에 표시할 데이터. 우선순위: 선택된 히스토리 항목 결과 > 최신 API 응답. */
  const displayResult = selectedHistoryResult ?? result ?? undefined;

  const handleSelectHistoryItem = (item: BlogHistoryItem) => {
    if (item.result) {
      setSelectedHistoryResult(item.result);
      setScrollToTopTrigger((t) => t + 1);
      setIsHistoryOpen(false);
    }
  };

  const handleRemoveHistoryItem = (index: number) => {
    removeHistoryItemAtIndex(index);
    setHistoryItems(getHistory());
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

  return (
    <main className="h-[calc(100vh-81px)] flex relative">
      <aside className="hidden w-80 shrink-0 border-r border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 md:flex md:flex-col">
        <InputSection {...inputSectionProps} />
      </aside>

      <div
        data-allow-transition
        className="fixed left-0 right-0 z-30 flex flex-col overflow-hidden border-t border-zinc-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] md:hidden"
        style={{
          bottom: isInputOpen ? 0 : "calc(1rem + 40px + max(1rem, env(safe-area-inset-bottom)))",
          height: isInputOpen ? "100vh" : `${MOBILE_CLOSED_HEIGHT}px`,
          paddingTop: "env(safe-area-inset-top, 0px)",
          transition: "bottom 300ms cubic-bezier(0.32, 0.72, 0, 1), height 300ms cubic-bezier(0.32, 0.72, 0, 1)",
          width: "100%",
        }}
      >
        <button
          type="button"
          onClick={() => setIsInputOpen((prev) => !prev)}
          className="shrink-0 h-12 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800"
          aria-label={isInputOpen ? "입력 영역 접기" : "입력 영역 펼치기"}
        >
          {isInputOpen ? (
            <HiChevronDown className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
          ) : (
            <HiChevronUp className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
          )}
        </button>
        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden p-6 pb-24 transition-[max-height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            maxHeight: isInputOpen ? "none" : 0,
            overflow: isInputOpen ? "visible" : "hidden",
            padding: isInputOpen ? undefined : 0,
          }}
        >
          <InputSection
            {...inputSectionProps}
            hideSubmitButton
            formId={MOBILE_FORM_ID}
          />
        </div>
      </div>
      <div
        className="fixed left-0 right-0 bottom-0 z-40 flex gap-2 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden dark:bg-zinc-900"
        style={{ width: "100%" }}
      >
        <Button
          text={isPending ? "생성 중..." : "블로그 글 생성"}
          type="submit"
          form={MOBILE_FORM_ID}
          disabled={isPending}
          className="flex-1 min-w-0"
        />
        <button
          type="button"
          onClick={() => setIsHistoryOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 focus:ring-2 focus:ring-purple-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white dark:focus:ring-purple-600"
          aria-label="히스토리"
        >
          <MdHistory className="h-5 w-5" />
        </button>
      </div>

      {/* 데스크톱: ResultSection 우측 상단, 헤더 하단 고정 히스토리 버튼 */}
      <button
        type="button"
        onClick={() => setIsHistoryOpen((prev) => !prev)}
        className="fixed top-24 right-4 z-30 hidden md:inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 shadow-sm outline-none hover:bg-zinc-50 hover:text-zinc-900 focus:ring-2 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white dark:focus:ring-purple-600"
        aria-label="히스토리"
      >
        <MdHistory className="h-5 w-5" />
      </button>

      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onSelectItem={handleSelectHistoryItem}
        onRemoveItem={handleRemoveHistoryItem}
      />

      {/* 결과 영역. 히스토리 패널 열림 시 배경 오버레이 표시, 오버레이 클릭 시 패널 닫힘 */}
      <div className="relative flex-1 min-w-0 min-h-0 flex flex-col">
        {isHistoryOpen && (
          <button
            type="button"
            onClick={() => setIsHistoryOpen(false)}
            className="absolute top-0 left-0 right-0 bottom-[4.5rem] md:bottom-0 z-40 bg-black/30"
            aria-label="히스토리 패널 닫기"
          />
        )}
        <ResultSection
          result={displayResult}
          isPending={isPending}
          scrollToTopTrigger={scrollToTopTrigger}
        />
      </div>
    </main>
  );
}
