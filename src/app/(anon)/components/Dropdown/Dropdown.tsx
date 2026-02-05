"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  id?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function Dropdown({
  label,
  options,
  value,
  onChange,
  id,
  disabled,
  error = false,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label ?? "";

  const baseStyles =
    "h-10 w-full rounded border bg-white px-3 py-2 text-foreground outline-none transition-colors";
  const stateStyles = error
    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
    : "border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200";
  const disabledStyles =
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50";

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-zinc-700 mb-1"
        >
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={`${baseStyles} flex items-center justify-between text-left ${stateStyles} ${disabledStyles} ${className}`.trim()}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{displayLabel}</span>
        <svg
          className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border border-zinc-200 bg-white shadow-lg"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange({ target: { value: opt.value } } as ChangeEvent<HTMLSelectElement>);
                setIsOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm text-foreground transition-colors hover:bg-zinc-100"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
