"use client";

import type { InputSectionProps } from "./components/InputSection";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";
import { InputSection } from "./components/InputSection";
import { ResultSection } from "./components/ResultSection";
import { MdHistory } from "react-icons/md";

export interface CreatePageDesktopProps {
  inputSectionProps: InputSectionProps;
  displayResult: GenerateResponseDto | undefined;
  errorMessage: string | null;
  isPending: boolean;
  isHistoryOpen: boolean;
  onHistoryClose: () => void;
  onHistoryToggle: () => void;
}

function HistoryToggleButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed right-4 top-24 z-30 inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 shadow-sm outline-none hover:bg-zinc-50 hover:text-zinc-900 focus:ring-2 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white dark:focus:ring-purple-600"
      aria-label="히스토리"
    >
      <MdHistory className="h-5 w-5" />
    </button>
  );
}

export function CreatePageDesktop({
  inputSectionProps,
  displayResult,
  errorMessage,
  isPending,
  isHistoryOpen,
  onHistoryClose,
  onHistoryToggle,
}: CreatePageDesktopProps) {
  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-row relative">
      <aside className="flex min-h-0 w-80 shrink-0 flex-col border-r border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <InputSection {...inputSectionProps} submitAtBottom />
      </aside>

      {!isHistoryOpen && <HistoryToggleButton onClick={onHistoryToggle} />}

      <div className="relative flex-1 min-w-0 min-h-0 flex flex-col">
        {isHistoryOpen && (
          <button
            type="button"
            onClick={onHistoryClose}
            className="absolute inset-0 z-[70] bg-black/30"
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
        />
      </div>
    </main>
  );
}
