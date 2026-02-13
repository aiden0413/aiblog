import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";

/** 히스토리 목록 조회 시 한 항목 */
export interface GetHistoryItemDto {
  id: string;
  topic: string;
  keywords: string[];
  style: StyleType;
  result: GenerateResponseDto;
  createdAt: string;
}

/** 히스토리 목록 조회 API 응답 */
export interface GetHistoryResponseDto {
  items: GetHistoryItemDto[];
}
