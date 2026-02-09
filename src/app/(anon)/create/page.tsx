"use client";

import { FormEvent, useState } from "react";
import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import { useGenerateBlog } from "@/hooks/useGenerateBlog";
import type { InputSectionProps } from "./components/InputSection";
import { InputSection } from "./components/InputSection";
import { ResultSection } from "./components/ResultSection";
import { Button } from "../components/commons/Button";

const MOBILE_FORM_ID = "create-blog-form-mobile";
const MOBILE_CLOSED_HEIGHT = 48;

export default function CreatePage() {
  const [topic, setTopic] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [style, setStyle] = useState<StyleType>("tutorial");
  const [isInputOpen, setIsInputOpen] = useState(false);

  const { mutate, data: result, error, isPending } = useGenerateBlog();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    mutate({
      topic: topic.trim(),
      keywords,
      style,
    });
    setIsInputOpen(false);
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
          <span
            className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-none"
            style={{
              transform: isInputOpen ? "rotate(-90deg)" : "rotate(90deg)",
            }}
          >
            ‹
          </span>
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
        className="fixed left-0 right-0 bottom-0 z-40 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden dark:bg-zinc-900"
        style={{ width: "100%" }}
      >
        <Button
          text={isPending ? "생성 중..." : "블로그 글 생성"}
          type="submit"
          form={MOBILE_FORM_ID}
          disabled={isPending}
          className="w-full"
        />
      </div>

      {/* 결과 영역 */}
      <ResultSection result={result} isPending={isPending} />
    </main>
  );
}
