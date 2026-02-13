/** OpenAI 블로그 생성 API 응답 엔티티 */
export class OpenAIGenerateResultEntity {
  constructor(
    public title: string,
    public content: string,
    public hashtags: string[],
    public metaDescription: string
  ) {}
}
