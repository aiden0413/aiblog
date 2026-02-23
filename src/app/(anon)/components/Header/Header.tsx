"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useAuth } from "@/lib/AuthProvider";
import { UserMenu } from "./UserMenu";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isLoading, isConfigured, signInWithGoogle, signOut } = useAuth();

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mx-auto flex h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-white">
          AI 블로그
        </Link>

        <div className="flex items-center gap-2">
          {mounted && isConfigured && isLoading && (
            <div
              className="flex shrink-0 items-center justify-center rounded-md p-2"
              aria-hidden
            >
              <div className="h-8 w-8 rounded-full bg-zinc-200 animate-pulse dark:bg-zinc-700" />
            </div>
          )}
          {mounted && isConfigured && !isLoading && (
            <UserMenu
              user={user}
              onSignIn={signInWithGoogle}
              onSignOut={signOut}
            />
          )}

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label={mounted && theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
            suppressHydrationWarning
          >
            {mounted && theme === "dark" ? (
              <HiOutlineSun className="h-5 w-5" />
            ) : (
              <HiOutlineMoon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
