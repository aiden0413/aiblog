import type { OpenAIGenerateResult } from "@/backend/domain/entities/OpenAIGenerateResult";

/** 글 스타일 (해당 엔티티 style 필드 타입) */
export type StyleType = "tutorial" | "til" | "troubleshooting";

/** 블로그 생성 히스토리 엔티티 */
export class BlogHistoryEntity {
  constructor(
    public id: string,
    public userId: string,
    public topic: string,
    public keywords: string[],
    public style: StyleType,
    public result: OpenAIGenerateResult,
    public createdAt: Date
  ) {}
}

/** 생성 후 저장 시 사용하는 컨텍스트 (BlogHistory 엔티티에서 userId, topic, keywords, style만) */
export type BlogHistoryContext = Pick<
  BlogHistoryEntity,
  "userId" | "topic" | "keywords" | "style"
>;
