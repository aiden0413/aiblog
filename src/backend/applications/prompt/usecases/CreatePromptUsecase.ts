import type {
  GenerateRequestDto,
  StyleType,
} from "@/backend/applications/prompt/dtos/GenerateRequestDto";
import type { OpenAIGenerateResult } from "@/backend/domain/entities/OpenAIGenerateResult";
import type { PromptGenerateRepository } from "@/backend/domain/repository/PromptGenerateRepository";

const STYLE_PROMPTS: Record<
  StyleType,
  { structure: string[]; description: string; label: string }
> = {
  tutorial: {
    label: "튜토리얼",
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
  til: {
    label: "TIL",
    structure: [
      "1. 학습 주제",
      "2. 학습한 내용",
      "3. 코드 예시",
      "4. 배운 점",
      "5. 추가 공부 방향",
    ],
    description: "TIL 형식으로, 위 구성 순서를 반드시 따르세요.",
  },
  troubleshooting: {
    label: "트러블슈팅",
    structure: [
      "1. 문제 상황",
      "2. 원인 분석",
      "3. 해결 과정",
      "4. 결론",
    ],
    description: "트러블슈팅 형식으로, 위 구성 순서를 반드시 따르세요.",
  },
};

const JSON_OUTPUT_INSTRUCTION = `
응답은 반드시 다음 JSON 형식으로만 작성해주세요. 다른 텍스트는 포함하지 마세요.
{
  "title": "글 제목",
  "content": "마크다운 형식의 본문 전체",
  "hashtags": ["해시태그1", "해시태그2", "해시태그3"],
  "metaDescription": "SEO용 메타 설명 (150자 이내)"
}`;

/**
 * 글 생성 요청을 받아 프롬프트를 만들고 Repository를 통해 블로그 글을 생성
 */
export class CreatePromptUsecase {
  constructor(private readonly promptGenerateRepository: PromptGenerateRepository) {}

  async execute(params: GenerateRequestDto): Promise<OpenAIGenerateResult> {
    const { topic, keywords, style } = params;

    const keywordPart =
      keywords.length > 0 ? `다음 키워드를 포함: ${keywords.join(", ")}.` : "";
    const template = STYLE_PROMPTS[style];
    const structurePart = template.structure.join("\n");

    const systemContent = [
      "당신은 블로그 글을 작성하는 전문가입니다.",
      "",
      `## ${template.label} 형식`,
      "구성:",
      structurePart,
      "",
      template.description,
      "코드 블록을 적절히 포함해주세요.",
      JSON_OUTPUT_INSTRUCTION,
    ].join("\n");

    const userContent = [
      `주제: ${topic}`,
      keywordPart,
      "위 조건에 맞는 블로그 글을 작성하고, JSON 형식으로 응답해주세요.",
    ]
      .filter(Boolean)
      .join("\n");

    return this.promptGenerateRepository.generate({ systemContent, userContent });
  }
}
