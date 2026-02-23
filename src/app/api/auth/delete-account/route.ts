import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "인증 설정을 불러올 수 없습니다." },
      { status: 503 }
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "회원탈퇴 처리를 할 수 없습니다." },
      { status: 503 }
    );
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: deleteError.message.includes("not found") ? 404 : 500 }
    );
  }

  return NextResponse.json({ success: true });
}
