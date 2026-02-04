import type { OpenAIGenerateResult } from "../entities/OpenAIGenerateResult";

/** 프롬프트를 받아 AI 생성 결과를 반환하는 Repository 인터페이스 */
export interface PromptGenerateRepository {
  generate(params: {
    systemContent: string;
    userContent: string;
  }): Promise<OpenAIGenerateResult>;
}
