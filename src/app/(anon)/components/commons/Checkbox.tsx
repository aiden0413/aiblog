"use client";

import { ChangeEvent } from "react";

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  disabled?: boolean;
}

export function Checkbox({
  label,
  checked,
  onChange,
  id,
  disabled = false,
}: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 rounded border-indigo-500 text-indigo-500 focus:ring-indigo-500"
      />
      <label htmlFor={id} className="text-sm font-medium text-black">
        {label}
      </label>
    </div>
  );
}
