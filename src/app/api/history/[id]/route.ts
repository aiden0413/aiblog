import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { DeleteBlogHistoryUsecase } from "@/backend/applications/history/usecases/DeleteBlogHistoryUsecase";
import { SupabaseBlogHistoryRepository } from "@/backend/infrastructure/repository/SupabaseBlogHistoryRepository";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "id가 필요합니다." },
      { status: 400 }
    );
  }

  const repo = new SupabaseBlogHistoryRepository(supabase);
  const usecase = new DeleteBlogHistoryUsecase(repo);
  try {
    const response = await usecase.execute({ id }, user.id);
    if (!response) {
      return NextResponse.json(
        { error: "해당 히스토리를 찾을 수 없거나 삭제할 수 없습니다." },
        { status: 404 }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "삭제 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
