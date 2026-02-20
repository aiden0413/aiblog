"use client";

import { useState, type KeyboardEvent, type ClipboardEvent } from "react";
import { TextInput } from "../../components/commons/TextInput";
import { HiX } from "react-icons/hi";

function parseChips(value: string): string[] {
  return value
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

function joinChips(chips: string[]): string {
  return chips.join(", ");
}

export interface ChipInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
}

export function ChipInput({
  id,
  label,
  value,
  onChange,
  placeholder = "예: React, Hooks",
  required = false,
  name = "chips",
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");
  const chips = parseChips(value);

  const addChip = (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    const next = [...chips];
    if (next.includes(trimmed)) return;
    next.push(trimmed);
    onChange(joinChips(next));
  };

  const removeChip = (index: number) => {
    const next = chips.filter((_, i) => i !== index);
    onChange(next.length ? joinChips(next) : "");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChip(inputValue);
      setInputValue("");
    }
  };

  const handleInputChange = (newValue: string) => {
    if (newValue.includes(",")) {
      const parts = newValue.split(",");
      const toAdd = parts.slice(0, -1).map((p) => p.trim()).filter(Boolean);
      const remainder = parts[parts.length - 1];
      const merged = [...chips];
      for (const w of toAdd) {
        if (w && !merged.includes(w)) merged.push(w);
      }
      if (merged.length !== chips.length) {
        onChange(joinChips(merged));
      }
      setInputValue(remainder);
    } else {
      setInputValue(newValue);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted.includes(",")) {
      e.preventDefault();
      const toAdd = pasted.split(",").map((k) => k.trim()).filter(Boolean);
      const merged = [...chips];
      for (const w of toAdd) {
        if (w && !merged.includes(w)) merged.push(w);
      }
      onChange(merged.length ? joinChips(merged) : value);
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-black mb-1 dark:text-zinc-200"
      >
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-2 min-h-10 rounded border border-purple-200 bg-white px-3 py-2 text-foreground placeholder:text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus-within:border-purple-500 dark:focus-within:border-purple-500">
        {chips.map((chip, i) => (
          <span
            key={`${chip}-${i}`}
            className="inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
          >
            {chip}
            <button
              type="button"
              onClick={() => removeChip(i)}
              className="rounded p-1 hover:bg-purple-200 dark:hover:bg-purple-800"
              aria-label={`${chip} 제거`}
            >
              <HiX className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <TextInput
          id={id}
          variant="inline"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={chips.length > 0 ? "" : placeholder}
          className="min-w-0 flex-1 border-none ring-0 shadow-none text-zinc-900 placeholder-zinc-400 dark:text-zinc-100"
        />
      </div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={() => {}}
        readOnly
        required={required}
        aria-hidden
        className="sr-only"
        tabIndex={-1}
      />
    </div>
  );
}
