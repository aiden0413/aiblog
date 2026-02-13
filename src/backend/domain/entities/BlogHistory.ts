import type { StyleType } from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";

/** 블로그 생성 히스토리 엔티티 */
export class BlogHistoryEntity {
  constructor(
    public id: string,
    public userId: string,
    public topic: string,
    public keywords: string[],
    public style: StyleType,
    public result: GenerateResponseDto,
    public createdAt: Date
  ) {}
}

/** 생성 후 저장 시 사용하는 컨텍스트 (userId, topic, keywords, style) */
export type GenerateContext = Pick<
  BlogHistoryEntity,
  "userId" | "topic" | "keywords" | "style"
>;
