import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

/** 브라우저용 Supabase 클라이언트 싱글톤 */
export function getSupabase(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!instance) {
    instance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return instance;
}

/** @deprecated getSupabase() 사용 권장 */
export const createClient = getSupabase;
