"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiLogin } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { HiLogout, HiPencil } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { HiTrash } from "react-icons/hi";
import type { User } from "@supabase/supabase-js";

interface UserMenuProps {
  user: User | null;
  onSignOut: () => void;
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
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

  useEffect(() => {
    if (!showDeleteConfirm) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && !isDeleting) setShowDeleteConfirm(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showDeleteConfirm, isDeleting]);

  if (!user) {
    return (
      <Link
        href="/signin"
        className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        <CiLogin className="h-5 w-5" />
        로그인
      </Link>
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
        ) : (user.user_metadata?.name as string)?.[0] ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
            {(user.user_metadata?.name as string)[0].toUpperCase()}
          </span>
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
            <FiUser className="h-5 w-5" />
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
            <FiUser className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
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
          <div className="border-t border-zinc-200 dark:border-zinc-700" />
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => {
              setIsOpen(false);
              setDeleteError(null);
              setShowDeleteConfirm(true);
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 disabled:opacity-50"
            role="menuitem"
          >
            <HiTrash className="h-4 w-4 shrink-0" />
            회원탈퇴
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          aria-describedby="delete-account-desc"
        >
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/60"
            aria-hidden="true"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h2
              id="delete-account-title"
              className="text-lg font-semibold text-zinc-800 dark:text-zinc-200"
            >
              회원탈퇴
            </h2>
            <p
              id="delete-account-desc"
              className="mt-2 text-sm text-zinc-600 dark:text-zinc-400"
            >
              정말 탈퇴하시겠습니까? 계정과 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            {deleteError && (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
              >
                {deleteError}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-400 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:focus:ring-zinc-500"
              >
                취소
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  setDeleteError(null);
                  try {
                    const res = await fetch("/api/auth/delete-account", {
                      method: "POST",
                    });
                    const data = (await res.json()) as { error?: string };
                    if (!res.ok) {
                      setDeleteError(data.error ?? "회원탈퇴에 실패했습니다.");
                      return;
                    }
                    setShowDeleteConfirm(false);
                    onSignOut();
                  } catch {
                    setDeleteError("회원탈퇴 요청 중 오류가 발생했습니다.");
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 disabled:opacity-50 dark:border-red-600 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-600"
              >
                {isDeleting ? "처리 중…" : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
