import type { SelectHTMLAttributes } from "react";

export function Select({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-muted">{label}</span>
      <span className="flex items-center gap-2 rounded-full border-[1.5px] border-divider bg-app px-4 py-3 transition-colors focus-within:border-accent-500 focus-within:ring-[3px] focus-within:ring-accent-200">
        <select
          className="w-full min-w-0 bg-transparent text-[15px] text-ink outline-none"
          {...props}
        >
          {children}
        </select>
      </span>
    </label>
  );
}
