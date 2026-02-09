import OpenAI from "openai";
import type { OpenAIGenerateResult } from "@/backend/domain/entities/OpenAIGenerateResult";
import type { PromptGenerateRepository } from "@/backend/domain/repository/PromptGenerateRepository";

export class OpenAIRepository implements PromptGenerateRepository {
  private readonly client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey ?? process.env["OPENAI_API_KEY"],
    });
  }

  async generate(params: {
    systemContent: string;
    userContent: string;
  }): Promise<OpenAIGenerateResult> {
    const { systemContent, userContent } = params;

    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userContent },
      ],
      max_tokens: 4096,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";
    if (!rawContent) {
      throw new Error("OpenAI 응답에서 생성된 내용을 찾을 수 없습니다.");
    }

    const parsed = this.parseJsonResponse(rawContent);
    return {
      title: parsed.title ?? "",
      content: parsed.content ?? "",
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
      metaDescription: parsed.metaDescription ?? "",
    };
  }

  private parseJsonResponse(raw: string): Partial<OpenAIGenerateResult> {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON 형식의 응답을 파싱할 수 없습니다.");
    }
    try {
      return JSON.parse(jsonMatch[0]) as Partial<OpenAIGenerateResult>;
    } catch {
      throw new Error("JSON 파싱에 실패했습니다.");
    }
  }
}
