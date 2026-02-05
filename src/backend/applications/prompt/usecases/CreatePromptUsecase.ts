import type {
  PromptRequestDto,
  TemplateType,
} from "@/backend/applications/prompt/dtos/PromptRequestDto";
import type { OpenAIGenerateResult } from "@/backend/domain/entities/OpenAIGenerateResult";
import type { PromptGenerateRepository } from "@/backend/domain/repository/PromptGenerateRepository";

const TEMPLATE_PROMPTS: Record<
  TemplateType,
  { structure: string[]; description: string }
> = {
  튜토리얼: {
    structure: [
      "1. 개념 설명",
      "2. 사용 목적",
      "3. 사전 준비",
      "4. 단계별 설명",
      "5. 코드 예시",
      "6. 마무리",
    ],
    description: "튜토리얼 형식으로, 위 구성 순서를 반드시 따르세요.",
  },
  TIL: {
    structure: [
      "1. 학습 주제",
      "2. 학습한 내용",
      "3. 코드 예시",
      "4. 배운 점",
      "5. 추가 공부 방향",
    ],
    description: "TIL 형식으로, 위 구성 순서를 반드시 따르세요.",
  },
  트러블슈팅: {
    structure: [
      "1. 문제 상황",
      "2. 원인 분석",
      "3. 해결 과정",
      "4. 결론",
    ],
    description: "트러블슈팅 형식으로, 위 구성 순서를 반드시 따르세요.",
  },
};

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

    const template = TEMPLATE_PROMPTS[templateType];
    const structurePart = template.structure.join("\n");

    const systemContent = [
      "당신은 블로그 글을 작성하는 전문가입니다.",
      "",
      `## ${templateType} 형식`,
      "구성:",
      structurePart,
      "",
      template.description,
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
