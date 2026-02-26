"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/AuthProvider";
import { getAuthErrorMessage } from "@/lib/authErrorMessage";

export default function SignupPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      router.replace("/create");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setIsLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setError("인증 설정을 불러올 수 없습니다.");
      setIsLoading(false);
      return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback?next=/signin&confirmed=1`,
      },
    });

    setIsLoading(false);

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError.message));
      return;
    }

    setSuccessMessage(
      "가입 신청이 완료되었습니다. 이메일에서 인증 링크를 확인해 주세요. 인증 후 로그인할 수 있습니다."
    );
    setTimeout(() => {
      router.push("/signin");
      router.refresh();
    }, 3000);
  };

  if (authLoading || user) {
    return null;
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto bg-gradient-to-b from-purple-50 to-white px-6 dark:from-zinc-900 dark:to-zinc-950" style={{ minHeight: 0 }}>
        <div className="flex min-h-full min-w-0 flex-col items-center justify-center py-8">
      <div className="w-full min-w-sm max-w-sm shrink-0 space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            회원가입
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            이메일과 비밀번호만 입력하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {successMessage && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200"
            >
              {successMessage}
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              이메일
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              비밀번호
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              최소 6자 이상
            </p>
          </div>

          <div>
            <label
              htmlFor="signup-password-confirm"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              비밀번호 확인
            </label>
            <input
              id="signup-password-confirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
            {passwordConfirm && password !== passwordConfirm && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg border border-purple-500 bg-purple-500 py-2.5 font-medium text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-60 dark:border-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-600 dark:focus:ring-offset-zinc-900"
          >
            {isLoading ? "가입 중…" : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/signin"
            className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
          >
            로그인
          </Link>
        </p>
      </div>
        </div>
      </div>
    </main>
  );
}
