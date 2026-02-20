"use client";

import { FormEvent } from "react";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import { TextInput } from "../../components/commons/TextInput";
import { Button } from "../../components/commons/Button";
import { ChipInput } from "./ChipInput";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

const STYLE_OPTIONS: { value: StyleType; label: string }[] = [
  { value: "tutorial", label: "튜토리얼" },
  { value: "til", label: "TIL" },
  { value: "troubleshooting", label: "트러블슈팅" },
];

const STYLE_DESCRIPTIONS: Record<StyleType, string> = {
  tutorial: "단계별로 따라 할 수 있는 가이드 형식입니다.",
  til: "오늘 배운 내용을 짧고 핵심 위주로 정리한 형식입니다. (Today I Learned)",
  troubleshooting: "문제 상황 → 원인 분석 → 해결 과정을 정리한 형식입니다.",
};

export interface InputSectionProps {
  topic: string;
  onTopicChange: (value: string) => void;
  keywordsInput: string;
  onKeywordsChange: (value: string) => void;
  style: StyleType;
  onStyleChange: (value: StyleType) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  /** true일 경우 제출 버튼을 숨김. 모바일 푸터의 별도 제출 버튼 사용 시 지정. */
  hideSubmitButton?: boolean;
  /** form 요소의 id. 외부 제출 버튼이 form 속성으로 이 폼을 참조할 때 사용. */
  formId?: string;
  /** 모바일 패널 열림 여부. 지정 시 상단에 열기/닫기 버튼을 렌더링. */
  isPanelOpen?: boolean;
  /** 모바일 패널 열림 상태 변경 콜백. isPanelOpen과 함께 지정 시 패널 토글 버튼 표시. */
  onPanelOpenChange?: (open: boolean) => void;
}

export function InputSection({
  topic,
  onTopicChange,
  keywordsInput,
  onKeywordsChange,
  style,
  onStyleChange,
  onSubmit,
  isPending,
  hideSubmitButton = false,
  formId,
  isPanelOpen,
  onPanelOpenChange,
}: InputSectionProps) {
  const formContent = (
    <>
      <h1 className="text-xl font-bold text-zinc-900 dark:text-white">블로그 글 생성</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        주제, 키워드, 글 스타일을 입력 후 생성 버튼을 누르세요.
      </p>
      <form id={formId} onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 space-y-6 min-h-0 overflow-y-auto">
          <TextInput
            id="topic"
            label="블로그 주제"
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="예: React useState 훅 사용법"
            required
          />

          <ChipInput
            id="keywords-input"
            name="keywords"
            label="키워드 (Enter 또는 쉼표로 추가)"
            value={keywordsInput}
            onChange={onKeywordsChange}
            placeholder="예: React, Hooks"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              글 스타일
            </label>
            <div className="flex gap-6 w-full">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onStyleChange(opt.value)}
                  className={`flex-1 px-2 py-3 rounded-md text-xs font-medium ${
                    style === opt.value
                      ? "bg-purple-600 text-white"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p
              className="text-xs text-zinc-500 dark:text-zinc-400 pt-1"
              role="status"
              aria-live="polite"
            >
              {STYLE_DESCRIPTIONS[style]}
            </p>
          </div>
        </div>

        {!hideSubmitButton && (
          <div className="mt-auto pt-6 shrink-0 space-y-4">
            <Button
              text={isPending ? "생성 중..." : "블로그 글 생성"}
              type="submit"
              disabled={isPending}
              className="w-full"
            />
          </div>
        )}
      </form>
    </>
  );

  if (onPanelOpenChange != null && isPanelOpen != null) {
    return (
      <>
        <button
          type="button"
          onClick={() => onPanelOpenChange(!isPanelOpen)}
          className="shrink-0 h-12 flex flex-col items-center justify-center bg-white dark:bg-zinc-900"
          aria-label={isPanelOpen ? "입력 영역 접기" : "입력 영역 펼치기"}
        >
          {isPanelOpen ? (
            <HiChevronDown className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
          ) : (
            <HiChevronUp className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
          )}
        </button>
        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-6"
          style={{ minHeight: 0 }}
        >
          {formContent}
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 w-full max-w-full flex-col flex-1">
      {formContent}
    </div>
  );
}
