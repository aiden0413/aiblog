"use client";

import { FormEvent, useState, useEffect } from "react";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";
import { useGenerateBlog } from "@/hooks/useGenerateBlog";
import { useBlogHistory } from "@/hooks/useBlogHistory";
import { useAuth } from "@/lib/AuthProvider";
import { addHistoryItem, type BlogHistoryItem } from "@/lib/blogHistory";
import { useToast } from "../components/commons/Toast";
import type { InputSectionProps } from "./components/InputSection";
import { HistoryPanel } from "./components/HistoryPanel";
import { CreatePageMobile } from "./CreatePageMobile";
import { CreatePageDesktop } from "./CreatePageDesktop";

const MOBILE_FORM_ID = "create-blog-form-mobile";

export default function CreatePage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    historyItems,
    refetch: refetchHistory,
    removeItem: removeHistoryItem,
    fetchError: historyFetchError,
    deleteError: historyDeleteError,
    clearDeleteError: clearHistoryDeleteError,
  } = useBlogHistory(user?.id ?? null, authLoading);

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

  const {
    mutate,
    data: result,
    isPending,
    error: generateError,
    reset: resetGenerateError,
  } = useGenerateBlog();

  const showToast = useToast();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    if (!topic.trim()) {
      showToast("주제를 입력해 주세요.");
      return;
    }
    if (keywords.length === 0) {
      showToast("키워드를 입력해 주세요.");
      return;
    }

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
      setSelectedHistoryResult({ ...item.result });
      setIsHistoryOpen(false);
      setIsInputOpen(false);
    }
  };

  const handleRemoveHistoryItem = (index: number) => {
    const itemToRemove = historyItems[index];
    return removeHistoryItem(index).then(() => {
      if (
        selectedHistoryResult &&
        itemToRemove?.result &&
        itemToRemove.result.title === selectedHistoryResult.title &&
        itemToRemove.result.content === selectedHistoryResult.content
      ) {
        setSelectedHistoryResult(null);
      }
    });
  };

  const handleHistoryToggle = () => {
    setIsInputOpen(false);
    setIsHistoryOpen((prev) => !prev);
  };

  const handleInputPanelOpenChange = (open: boolean) => {
    setIsInputOpen(open);
    if (open) setIsHistoryOpen(false);
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
    noValidate: true,
  };

  const errorMessage = generateError ?? null;

  const commonProps = {
    inputSectionProps,
    displayResult,
    errorMessage,
    isPending,
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
          onInputPanelOpenChange={handleInputPanelOpenChange}
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
