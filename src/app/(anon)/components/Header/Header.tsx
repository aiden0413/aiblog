"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mx-auto flex h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-white">
          AI 블로그
        </Link>

        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          {theme === "dark" ? (
            <HiOutlineSun className="h-5 w-5" />
          ) : (
            <HiOutlineMoon className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
}
