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
    });

    const content = completion.choices[0]?.message?.content ?? "";
    if (!content) {
      throw new Error("OpenAI 응답에서 생성된 내용을 찾을 수 없습니다.");
    }

    return { content };
  }
}