import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { GetBlogHistoryUsecase } from "@/backend/applications/history/usecases/GetBlogHistoryUsecase";
import { SupabaseBlogHistoryRepository } from "@/backend/infrastructure/repository/SupabaseBlogHistoryRepository";

export async function GET(request: NextRequest) {
  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "서버 설정 오류" },
      { status: 500 }
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const getRequest = {
    limit: limitParam ? Number(limitParam) : undefined,
  };

  const repo = new SupabaseBlogHistoryRepository(supabase);
  const usecase = new GetBlogHistoryUsecase(repo);
  const response = await usecase.execute(user.id, getRequest);
  return NextResponse.json(response);
}
