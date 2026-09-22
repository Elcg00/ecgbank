"use client";

import { useState, type ChangeEvent } from "react";
import { centsToInputValue } from "@/lib/format";

function digitsOnly(value: string): string {
  const raw = value.replace(/\D/g, "");
  return raw ? String(Number(raw)) : "";
}

function digitsToDisplay(digits: string): string {
  return digits ? centsToInputValue(Number(digits)) : "";
}

/** Money input that formats "R$ 1.234,56" live as the user types, digit by digit. */
export function MoneyField({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  /** Brazilian-formatted string, e.g. the output of centsToInputValue(). */
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [digits, setDigits] = useState<string>(() => digitsOnly(defaultValue ?? ""));

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setDigits(digitsOnly(e.target.value));
  }

  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-muted">{label}</span>
      <span className="flex items-center gap-2 rounded-full border border-divider bg-app px-4 py-3 focus-within:border-accent-700">
        <span className="text-ink-muted">R$</span>
        <input
          name={name}
          className="w-full min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-muted"
          inputMode="decimal"
          value={digitsToDisplay(digits)}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
        />
      </span>
    </label>
  );
}
