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
}: InputSectionProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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

      <div className="flex justify-center">
        <Button
          text={isPending ? "생성 중..." : "블로그 글 생성"}
          type="submit"
          disabled={isPending}
        />
      </div>
    </form>
  );
}
