"use client";

import Link from "next/link";

export default function SignupCompletePage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className="min-h-0 flex-1 overflow-x-auto overflow-y-auto bg-gradient-to-b from-purple-50 to-white px-6 dark:from-zinc-900 dark:to-zinc-950"
        style={{ minHeight: 0 }}
      >
        <div className="flex min-h-full min-w-0 flex-col items-center justify-center py-8">
          <div className="w-full min-w-sm max-w-sm shrink-0 space-y-8 p-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              가입이 완료되었습니다
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              로그인하여 서비스를 이용해 주세요.
            </p>
            <Link
              href="/signin"
              className="inline-block w-full rounded-lg border border-purple-500 bg-purple-500 py-2.5 font-medium text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-600 dark:focus:ring-offset-zinc-900"
            >
              로그인 페이지로 이동
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
