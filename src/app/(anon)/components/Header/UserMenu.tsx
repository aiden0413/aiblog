"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiLogout, HiPencil, HiUser } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import type { User } from "@supabase/supabase-js";

interface UserMenuProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function UserMenu({ user, onSignIn, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        type="button"
        onClick={onSignIn}
        className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        로그인
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        aria-label="사용자 메뉴"
        aria-expanded={isOpen}
      >
        {user.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt="프로필"
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
            {(user.user_metadata?.name as string)?.[0]?.toUpperCase() ?? "?"}
          </span>
        )}
      </button>
      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[11rem] max-w-[16rem] rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          role="menu"
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400"
            role="presentation"
          >
            <HiUser className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
            <span className="min-w-0 truncate" title={user.email ?? undefined}>
              {user.email ?? (user.user_metadata?.name as string) ?? "계정"}
            </span>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-700" />
          <Link
            href="/create"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            role="menuitem"
          >
            <HiPencil className="h-4 w-4 shrink-0" />
            글 생성
          </Link>
          <Link
            href="/history"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            role="menuitem"
          >
            <MdHistory className="h-4 w-4 shrink-0" />
            작성 히스토리
          </Link>
          <button
            type="button"
            onClick={() => {
              onSignOut();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            role="menuitem"
          >
            <HiLogout className="h-4 w-4 shrink-0" />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
