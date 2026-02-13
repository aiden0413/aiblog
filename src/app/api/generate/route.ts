import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { CreatePromptUsecase } from "@/backend/applications/prompt/usecases/CreatePromptUsecase";
import { createPromptGenerateRepository } from "@/backend/infrastructure/repository/OpenAIRepository";
import type { GenerateResponseDto } from "@/backend/applications/prompt/dtos/GenerateResponseDto";
import type {
  GenerateRequestDto,
  StyleType,
} from "@/backend/applications/prompt/dtos/GenerateRequestDto";

const STYLE_TYPES: StyleType[] = ["tutorial", "til", "troubleshooting"];

function parseBody(body: unknown): GenerateRequestDto | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const topic = typeof o.topic === "string" ? o.topic.trim() : "";
  const style = o.style as StyleType | undefined;
  const keywords = Array.isArray(o.keywords)
    ? (o.keywords as unknown[]).filter((k): k is string => typeof k === "string")
    : [];

  if (!topic || !STYLE_TYPES.includes(style ?? ("" as StyleType))) {
    return null;
  }
  return { topic, keywords, style: style! };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const params = parseBody(body);
    if (!params) {
      return NextResponse.json(
        {
          error:
            "잘못된 요청입니다. topic, keywords, style(tutorial|til|troubleshooting)를 확인해주세요.",
        },
        { status: 400 }
      );
    }

    const supabase = await getSupabase();
    let userId: string | undefined;

    if (supabase) {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (!authError && user) {
        userId = user.id;
      }
    }

    const requestDto: GenerateRequestDto = {
      ...params,
      ...(userId ? { userId } : {}),
    };

    const promptGenerateRepository = createPromptGenerateRepository(supabase);
    const usecase = new CreatePromptUsecase(promptGenerateRepository);
    const result = await usecase.execute(requestDto);

    // Domain Entity를 Application DTO로 변환
    const dto: GenerateResponseDto = {
      title: result.title,
      content: result.content,
      hashtags: result.hashtags,
      metaDescription: result.metaDescription,
    };

    return NextResponse.json(dto);
  } catch (err) {
    const message = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
