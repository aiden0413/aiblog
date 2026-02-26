import type { BlogHistoryContext } from "../entities/BlogHistory";
import type { OpenAIGenerateResultEntity } from "../entities/OpenAIGenerateResult";

/** 프롬프트를 받아 AI 생성 결과를 반환. context 있으면 생성 후 DB 저장까지 수행. */
export interface PromptGenerateRepository {
  generate(
    params: { systemContent: string; userContent: string },
    context?: BlogHistoryContext
  ): Promise<OpenAIGenerateResultEntity>;
}
