"use client";

export interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  /** 제출할 form 요소의 id (type="submit"일 때) */
  form?: string;
}

export function Button({
  text,
  type = "button",
  disabled = false,
  onClick,
  className = "",
  form,
}: ButtonProps) {
  const baseStyles =
    "h-10 min-w-32 rounded border border-indigo-500 bg-indigo-500 px-4 py-2 font-medium text-white outline-none hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-600";

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
    >
      {text}
    </button>
  );
}
