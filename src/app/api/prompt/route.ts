import { NextRequest, NextResponse } from "next/server";
import { CreatePromptUsecase } from "@/backend/applications/prompt/usecases/CreatePromptUsecase";
import { OpenAIRepository } from "@/backend/infrastructure/repository/OpenAIRepository";
import type { PromptRequestDto, TemplateType } from "@/backend/applications/prompt/dtos/PromptRequestDto";

const TEMPLATE_TYPES: TemplateType[] = ["튜토리얼", "TIL", "트러블슈팅"];

function parseBody(body: unknown): PromptRequestDto | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const topic = typeof o.topic === "string" ? o.topic.trim() : "";
  const templateType = o.templateType as TemplateType | undefined;
  const includeCode = typeof o.includeCode === "boolean" ? o.includeCode : false;
  const keywords = Array.isArray(o.keywords)
    ? (o.keywords as unknown[]).filter((k): k is string => typeof k === "string")
    : [];

  if (!topic || !TEMPLATE_TYPES.includes(templateType ?? ("" as TemplateType))) {
    return null;
  }
  return { topic, keywords, templateType: templateType!, includeCode };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const params = parseBody(body);
    if (!params) {
      return NextResponse.json(
        {
          error:
            "잘못된 요청입니다. topic, keywords, templateType(튜토리얼|TIL|트러블슈팅), includeCode를 확인해주세요.",
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
