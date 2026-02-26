"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/AuthProvider";
import { getAuthErrorMessage } from "@/lib/authErrorMessage";

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "A1b@C2d#E3f$G4h!";

export default function SignInPage() {
  const router = useRouter();
  const {
    user,
    isLoading: authLoading,
    signInWithGoogle,
    isConfigured,
    signInError,
    clearSignInError,
  } = useAuth();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<string | null>(null);
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
    setIsLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setError("인증 설정을 불러올 수 없습니다.");
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (signInError) {
      setError(getAuthErrorMessage(signInError.message));
      return;
    }

    router.push("/create");
    router.refresh();
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
            로그인
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            데모 계정이 이미 입력되어 있습니다. 아래 로그인 버튼만 누르면 됩니다.
          </p>
        </div>

        <div
          role="status"
          className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-center text-sm text-purple-800 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-200"
        >
          체험용 계정으로 바로 로그인해 보세요
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              htmlFor="signin-email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              이메일
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder={DEMO_EMAIL}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="signin-password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              비밀번호
            </label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder={DEMO_PASSWORD}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg border border-purple-500 bg-purple-500 py-2.5 font-medium text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-60 dark:border-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-600 dark:focus:ring-offset-zinc-900"
          >
            {isLoading ? "로그인 중…" : "로그인"}
          </button>
        </form>

        {isConfigured && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-purple-50 px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                  또는
                </span>
              </div>
            </div>
            {signInError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
              >
                {signInError}
                <button
                  type="button"
                  onClick={clearSignInError}
                  className="ml-2 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  aria-label="에러 메시지 닫기"
                >
                  닫기
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white py-2.5 font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-900"
            >
              <Image
                src="https://www.google.com/favicon.ico"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5"
              />
              Google로 로그인
            </button>
          </>
        )}

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
          >
            회원가입
          </Link>
        </p>
      </div>
        </div>
      </div>
    </main>
  );
}
