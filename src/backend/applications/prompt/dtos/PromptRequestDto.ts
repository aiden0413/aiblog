/** 글 템플릿 유형 */
export type TemplateType = "튜토리얼" | "TIL" | "트러블슈팅";

/** 글 생성 API 요청 */
export interface PromptRequestDto {
  /** 글 주제 */
  topic: string;
  /** 키워드 (복수 가능) */
  keywords: string[];
  /** 글 템플릿 유형 */
  templateType: TemplateType;
  /** 코드 포함 여부 */
  includeCode: boolean;
}
