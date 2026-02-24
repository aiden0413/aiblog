"use client";

import type { InputSectionProps } from "./components/InputSection";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";
import { InputSection } from "./components/InputSection";
import { ResultSection } from "./components/ResultSection";
import { Button } from "../components/commons/Button";
import { MdHistory } from "react-icons/md";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

export interface CreatePageMobileProps {
  inputSectionProps: InputSectionProps;
  displayResult: GenerateResponseDto | undefined;
  errorMessage: string | null;
  isPending: boolean;
  isOffline: boolean;
  isHistoryOpen: boolean;
  onHistoryClose: () => void;
  onHistoryToggle: () => void;
  isInputOpen: boolean;
  onInputPanelOpenChange: (open: boolean) => void;
  mobileFormId: string;
}

function HistoryToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 focus:ring-2 focus:ring-purple-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white dark:focus:ring-purple-600"
      aria-label="히스토리"
    >
      <MdHistory className="h-5 w-5" />
    </button>
  );
}

export function CreatePageMobile({
  inputSectionProps,
  displayResult,
  errorMessage,
  isPending,
  isOffline,
  isHistoryOpen,
  onHistoryClose,
  onHistoryToggle,
  isInputOpen,
  onInputPanelOpenChange,
  mobileFormId,
}: CreatePageMobileProps) {
  return (
    <>
      <main className="flex h-full min-h-0 w-full flex-1 flex-col relative">
      {/* 입력 패널: dvh 기준 높이. 푸터(4.5rem) 위에 배치. */}
      <div
        data-allow-transition
        className="fixed left-0 right-0 flex flex-col overflow-hidden bg-white dark:bg-zinc-900 z-30"
        style={{
          bottom: "4.5rem",
          height: isInputOpen ? "calc(100dvh - 4.5rem)" : "3rem",
          paddingTop: "env(safe-area-inset-top, 0px)",
          transition: "height 300ms cubic-bezier(0.32, 0.72, 0, 1)",
          width: "100%",
        }}
      >
        <button
          type="button"
          onClick={() => onInputPanelOpenChange(!isInputOpen)}
          className="shrink-0 h-12 flex flex-col items-center justify-center bg-zinc-100 text-zinc-600 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:active:bg-zinc-600"
          aria-label={isInputOpen ? "입력 영역 접기" : "입력 영역 펼치기"}
        >
          {isInputOpen ? (
            <HiChevronDown className="h-6 w-6" />
          ) : (
            <HiChevronUp className="h-6 w-6" />
          )}
        </button>
        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-6"
          style={{ minHeight: 0 }}
        >
          <InputSection
            {...inputSectionProps}
            hideSubmitButton
            formId={mobileFormId}
          />
        </div>
      </div>

      {/* 결과 영역만. 푸터는 main 직하단에 별도로 둠. */}
      <div className="relative flex-1 min-w-0 min-h-0 flex flex-col">
        {isHistoryOpen && (
          <button
            type="button"
            onClick={onHistoryClose}
            className="absolute top-0 left-0 right-0 bottom-[4.5rem] z-20 bg-black/30"
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
          isOffline={isOffline}
        />
      </div>
    </main>
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-zinc-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-zinc-700 dark:bg-zinc-900 min-[900px]:hidden">
        <Button
          text={isPending ? "생성 중..." : "블로그 글 생성"}
          type="submit"
          form={mobileFormId}
          disabled={isPending}
          className="flex-1 min-w-0"
        />
        <HistoryToggleButton onClick={onHistoryToggle} />
      </div>
    </>
  );
}
