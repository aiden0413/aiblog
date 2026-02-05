"use client";

export interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Button({
  text,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "h-10 min-w-32 rounded border border-indigo-500 bg-indigo-500 px-4 py-2 font-medium text-white outline-none transition-colors hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${className}`.trim()}
    >
      {text}
    </button>
  );
}
