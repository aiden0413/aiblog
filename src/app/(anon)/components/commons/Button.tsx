"use client";

import type { CSSProperties } from "react";

export interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  /** 제출 대상 form 요소의 id. type="submit"일 때만 유효. */
  form?: string;
  /** 툴팁 문자열. 호버 시 브라우저 기본 툴팁으로 표시됨. */
  title?: string;
  /** 인라인 스타일 객체. className보다 우선 적용됨. */
  style?: CSSProperties;
}

export function Button({
  text,
  type = "button",
  disabled = false,
  onClick,
  className = "",
  form,
  title,
  style,
}: ButtonProps) {
  const baseStyles =
    "h-10 min-w-32 rounded border border-purple-500 bg-purple-500 px-4 py-2 font-medium text-white outline-none hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-600";

  return (
    <button
      type={type}
      form={form}
      disabled={disabled}
      onClick={(e) => {
        onClick?.();
        e.currentTarget.blur();
      }}
      className={`${baseStyles} ${className}`.trim()}
      title={title}
      style={style}
    >
      {text}
    </button>
  );
}
