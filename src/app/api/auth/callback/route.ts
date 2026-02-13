import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  }

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(`${requestUrl.origin}/create?auth=complete`);
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
