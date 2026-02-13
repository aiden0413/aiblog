/** 글 스타일 */
export type StyleType = "tutorial" | "til" | "troubleshooting";

/** AI 글 생성 API 요청 */
export interface GenerateRequestDto {
  /** 블로그 주제 */
  topic: string;
  /** 관련 키워드 */
  keywords: string[];
  /** 글 스타일 */
  style: StyleType;
  /** 로그인 시 히스토리 저장용 (있으면 생성 후 DB 저장) */
  userId?: string;
}
