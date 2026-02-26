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
    const confirmed = requestUrl.searchParams.get("confirmed");
    const nextPath = requestUrl.searchParams.get("next") ?? "/create";
    const type = requestUrl.searchParams.get("type");
    const isEmailConfirmation =
      confirmed === "1" ||
      nextPath === "/signin" ||
      type === "signup" ||
      type === "email";
    if (isEmailConfirmation) {
      return NextResponse.redirect(`${requestUrl.origin}/signup/complete`);
    }
    return NextResponse.redirect(`${requestUrl.origin}${nextPath}?auth=complete`);
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
