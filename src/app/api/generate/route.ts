import { NextRequest, NextResponse } from "next/server";
import { CreatePromptUsecase } from "@/backend/applications/prompt/usecases/CreatePromptUsecase";
import { OpenAIRepository } from "@/backend/infrastructure/repository/OpenAIRepository";
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

    const promptGenerateRepository = new OpenAIRepository();
    const usecase = new CreatePromptUsecase(promptGenerateRepository);
    const result = await usecase.execute(params);

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
