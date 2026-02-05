/** OpenAI 블로그 생성 API 응답 */
export interface OpenAIGenerateResult {
  /** 생성된 제목 */
  title: string;
  /** 마크다운 형식의 본문 */
  content: string;
  /** 추천 해시태그 */
  hashtags: string[];
  /** SEO 메타 설명 */
  metaDescription: string;
}
