"use client";

import { ConfirmModal } from "../components/commons/ConfirmModal";
import { HistoryListSection } from "./components/HistoryListSection";
import { HistoryDetailSection } from "./components/HistoryDetailSection";
import type { HistoryPageProps } from "./types";

export function HistoryPageMobile(props: HistoryPageProps) {
  return (
    <div className="relative h-full min-h-0 w-full">
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

      {/* 결과 탭: 열고닫기 버튼(3rem) 밑 ~ 맨 하단까지 */}
      <div className="absolute inset-x-0 bottom-0 top-12 z-0 flex min-h-0 flex-col">
        <HistoryDetailSection
          selectedItem={props.selectedItem}
          emptyStateMessage="위쪽 목록에서 항목을 선택하면 생성된 글이 여기에 표시됩니다."
          fillResultHeightOnMobile
        />
      </div>

      {/* 리스트 패널: 결과 위에 겹쳐져 펼쳐졌다 접혔다 함 */}
      <HistoryListSection
        {...props}
        collapsible
        isListExpanded={props.isMobileListExpanded ?? true}
        onListExpandToggle={props.onMobileListExpandToggle}
        asideClassName="absolute left-0 right-0 top-0 z-10 flex w-full flex-col overflow-hidden bg-white transition-[height] duration-300 ease-out dark:bg-zinc-900"
        asideStyle={{
          height: props.isMobileListExpanded ? "calc(100dvh - 5rem)" : "3rem",
        }}
      />
    </div>
  );
}
