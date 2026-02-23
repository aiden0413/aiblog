"use client";

import { FormEvent, useState, useEffect } from "react";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";
import { useGenerateBlog } from "@/hooks/useGenerateBlog";
import { useBlogHistory } from "@/hooks/useBlogHistory";
import { useAuth } from "@/lib/AuthProvider";
import { addHistoryItem, type BlogHistoryItem } from "@/lib/blogHistory";
import type { InputSectionProps } from "./components/InputSection";
import { HistoryPanel } from "./components/HistoryPanel";
import { CreatePageMobile } from "./CreatePageMobile";
import { CreatePageDesktop } from "./CreatePageDesktop";

const MOBILE_FORM_ID = "create-blog-form-mobile";

export default function CreatePage() {
  const { user } = useAuth();
  const {
    historyItems,
    refetch: refetchHistory,
    removeItem: removeHistoryItem,
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

  const [selectedHistoryResult, setSelectedHistoryResult] = useState<
    GenerateResponseDto | null
  >(null);
  const [scrollToTopTrigger, setScrollToTopTrigger] = useState(0);

  const {
    mutate,
    data: result,
    isPending,
    error: generateError,
    reset: resetGenerateError,
  } = useGenerateBlog();
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
    const itemToRemove = historyItems[index];
    return removeHistoryItem(index).then(() => {
      if (selectedHistoryResult && itemToRemove?.result === selectedHistoryResult) {
        setSelectedHistoryResult(null);
      }
    });
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

  const commonProps = {
    inputSectionProps,
    displayResult,
    errorMessage,
    isPending,
    scrollToTopTrigger,
    isOffline,
    isHistoryOpen,
    onHistoryClose: () => setIsHistoryOpen(false),
    onHistoryToggle: handleHistoryToggle,
  };

  return (
    <>
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onSelectItem={handleSelectHistoryItem}
        onRemoveItem={handleRemoveHistoryItem}
        fetchError={historyFetchError}
        onRetryFetch={refetchHistory}
        deleteError={historyDeleteError}
        onDismissDeleteError={clearHistoryDeleteError}
      />

      {/* 모바일: 900px 미만에서만 표시. 높이를 dvh 기준으로 명시(헤더 81px 제외). */}
      <div className="flex h-[calc(100dvh-81px)] min-h-0 w-full flex-1 min-[900px]:hidden">
        <CreatePageMobile
          {...commonProps}
          isInputOpen={isInputOpen}
          onInputPanelOpenChange={setIsInputOpen}
          mobileFormId={MOBILE_FORM_ID}
        />
      </div>

      {/* PC: 900px 이상에서만 표시 */}
      <div className="hidden min-h-0 w-full flex-1 min-[900px]:flex">
        <CreatePageDesktop {...commonProps} />
      </div>
    </>
  );
}
