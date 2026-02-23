"use client";

import { ConfirmModal } from "../components/commons/ConfirmModal";
import { HistoryListSection } from "./components/HistoryListSection";
import { HistoryDetailSection } from "./components/HistoryDetailSection";
import type { HistoryPageProps } from "./types";

export function HistoryPageMobile(props: HistoryPageProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <ConfirmModal
        isOpen={props.pendingDeleteIndex !== null}
        title="히스토리 삭제"
        message="이 항목을 히스토리에서 삭제할까요?"
        confirmText={props.deleteRequested ? "삭제 중..." : "삭제"}
        cancelText="취소"
        confirmDisabled={props.deleteRequested}
        onConfirm={props.onConfirmDelete}
        onCancel={props.onCancelDelete}
      />

      <HistoryListSection
        {...props}
        asideClassName="flex h-[15rem] min-h-0 w-full shrink-0 flex-col border-b border-zinc-300 bg-zinc-50/50 dark:border-zinc-600 dark:bg-zinc-900/50"
      />

      <HistoryDetailSection
        selectedItem={props.selectedItem}
        emptyStateMessage="위쪽 목록에서 항목을 선택하면 생성된 글이 여기에 표시됩니다."
      />
    </div>
  );
}
