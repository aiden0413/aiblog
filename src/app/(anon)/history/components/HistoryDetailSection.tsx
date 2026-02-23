"use client";

import type { BlogHistoryItem } from "@/lib/blogHistory";
import { ResultSection } from "../../create/components/ResultSection";

export interface HistoryDetailSectionProps {
  selectedItem: BlogHistoryItem | null;
  emptyStateMessage: string;
}

export function HistoryDetailSection({
  selectedItem,
  emptyStateMessage,
}: HistoryDetailSectionProps) {
  return (
    <main className="flex min-h-0 flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      {selectedItem?.result ? (
        <ResultSection
          result={selectedItem.result}
          isOffline={false}
          scrollToTopTrigger={selectedItem.createdAt ? 1 : 0}
        />
      ) : selectedItem ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            이 항목에는 저장된 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {emptyStateMessage}
          </p>
        </div>
      )}
    </main>
  );
}
