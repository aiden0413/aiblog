"use client";

import { ChangeEvent } from "react";

export interface TextInputProps {
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  id,
  type = "text",
  required,
  disabled,
  error = false,
  className = "",
}: TextInputProps) {
  const baseStyles =
    "h-10 w-full rounded border bg-white px-3 py-2 text-foreground outline-none placeholder:text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500";
  const stateStyles = error
    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:border-red-600 dark:focus:ring-red-900"
    : "border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-zinc-600 dark:focus:border-purple-500 dark:focus:ring-purple-900";
  const disabledStyles =
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-purple-50 dark:disabled:bg-zinc-800";

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-black mb-1 dark:text-zinc-200"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${baseStyles} ${stateStyles} ${disabledStyles} ${className}`.trim()}
      />
    </div>
  );
}
