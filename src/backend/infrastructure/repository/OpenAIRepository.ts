import OpenAI from "openai";
import { OpenAIGenerateResultEntity } from "@/backend/domain/entities/OpenAIGenerateResult";
import type { BlogHistoryContext } from "@/backend/domain/entities/BlogHistory";
import type { PromptGenerateRepository } from "@/backend/domain/repository/PromptGenerateRepository";
import type { SupabaseClient } from "@supabase/supabase-js";

const BLOG_HISTORY_TABLE = "blog_history";

function parseJsonResponse(raw: string): Partial<OpenAIGenerateResultEntity> {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("JSON 형식의 응답을 파싱할 수 없습니다.");
  }
  try {
    return JSON.parse(jsonMatch[0]) as Partial<OpenAIGenerateResultEntity>;
  } catch {
    throw new Error("JSON 파싱에 실패했습니다.");
  }
}

export function createPromptGenerateRepository(
  supabase?: SupabaseClient | null
): PromptGenerateRepository {
  const client = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
  });
  const db = supabase ?? null;

  return {
    async generate(
      params: { systemContent: string; userContent: string },
      context?: BlogHistoryContext
    ): Promise<OpenAIGenerateResultEntity> {
      const { systemContent, userContent } = params;

      const completion = await client.chat.completions.create({
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

      const parsed = parseJsonResponse(rawContent);
      const result = new OpenAIGenerateResultEntity(
        parsed.title ?? "",
        parsed.content ?? "",
        Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
        parsed.metaDescription ?? ""
      );

      // 로그인된 상태: 여기서 DB에 저장. 비로그인 시 저장은 클라이언트(create 페이지 onSuccess)에서 localStorage로 처리.
      if (context && db) {
        const { error } = await db.from(BLOG_HISTORY_TABLE).insert({
          user_id: context.userId,
          topic: context.topic,
          keywords: context.keywords,
          style: context.style,
          result: {
            title: result.title,
            content: result.content,
            hashtags: result.hashtags,
            metaDescription: result.metaDescription,
          },
        });
        if (error) throw new Error(error.message);
      }

      return result;
    },
  };
}
