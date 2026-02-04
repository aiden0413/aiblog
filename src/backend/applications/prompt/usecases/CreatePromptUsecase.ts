import type { PromptRequestDto } from "@/backend/applications/prompt/dtos/PromptRequestDto";
import type { OpenAIGenerateResult } from "@/backend/domain/entities/OpenAIGenerateResult";
import type { PromptGenerateRepository } from "@/backend/domain/repository/PromptGenerateRepository";

/**
 * 글 생성 요청을 받아 프롬프트를 만들고 Repository를 통해 블로그 글을 생성
 */
export class CreatePromptUsecase {
  constructor(private readonly promptGenerateRepository: PromptGenerateRepository) {}

  async execute(params: PromptRequestDto): Promise<OpenAIGenerateResult> {
    const { topic, keywords, templateType, includeCode } = params;

    const keywordPart =
      keywords.length > 0 ? `다음 키워드를 포함: ${keywords.join(", ")}.` : "";
    const codePart = includeCode
      ? "코드 블록을 적절히 포함해주세요."
      : "코드는 포함하지 말고 설명 위주로 작성해주세요.";

    const systemContent = [
      "당신은 블로그 글을 작성하는 전문가입니다.",
      `글 템플릿: ${templateType}.`,
      codePart,
    ].join("\n");

    const userContent = [
      `주제: ${topic}`,
      keywordPart,
      "위 조건에 맞는 블로그 글을 마크다운으로 작성해주세요.",
    ]
      .filter(Boolean)
      .join("\n");

    return this.promptGenerateRepository.generate({ systemContent, userContent });
  }
}
