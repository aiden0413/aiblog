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
    "h-10 w-full rounded border bg-white px-3 py-2 text-foreground outline-none transition-colors";
  const stateStyles = error
    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
    : "border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200";
  const disabledStyles =
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50";

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-zinc-700 mb-1"
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
