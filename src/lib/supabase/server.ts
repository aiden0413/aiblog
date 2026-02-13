import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** 요청별 Supabase 클라이언트 (쿠키 기반 세션). 싱글톤이 아닌 요청 단위 인스턴스 반환 */
export async function getSupabase() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component에서는 쿠키 설정 불가 (무시)
        }
      },
    },
  });
}

/** @deprecated getSupabase() 사용 권장 */
export const createClient = getSupabase;
