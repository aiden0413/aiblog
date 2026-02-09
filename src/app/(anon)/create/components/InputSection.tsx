"use client";

import { FormEvent } from "react";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import { TextInput } from "../../components/commons/TextInput";
import { Button } from "../../components/commons/Button";

const STYLE_OPTIONS: { value: StyleType; label: string }[] = [
  { value: "tutorial", label: "튜토리얼" },
  { value: "til", label: "TIL" },
  { value: "troubleshooting", label: "트러블슈팅" },
];

export interface InputSectionProps {
  topic: string;
  onTopicChange: (value: string) => void;
  keywordsInput: string;
  onKeywordsChange: (value: string) => void;
  style: StyleType;
  onStyleChange: (value: StyleType) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  /** true면 제출 버튼 숨김 (모바일 푸터용 버튼 사용 시) */
  hideSubmitButton?: boolean;
  /** form id (외부 버튼이 form 속성으로 제출할 때 사용) */
  formId?: string;
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
}: InputSectionProps) {
  return (
    <div className="flex min-h-0 min-w-0 w-full max-w-full flex-col flex-1">
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

          <TextInput
            id="keywords"
            label="키워드 (쉼표로 구분)"
            type="text"
            value={keywordsInput}
            onChange={(e) => onKeywordsChange(e.target.value)}
            placeholder="예: React, Hooks, 상태관리"
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
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 shrink-0 space-y-4">
          {!hideSubmitButton && (
            <Button
              text={isPending ? "생성 중..." : "블로그 글 생성"}
              type="submit"
              disabled={isPending}
              className="w-full"
            />
          )}
        </div>
      </form>
    </div>
  );
}
