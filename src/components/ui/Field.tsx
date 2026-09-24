import type { InputHTMLAttributes } from "react";

export function Field({
  label,
  prefix,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; prefix?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-muted">{label}</span>
      <span className="flex items-center gap-2 rounded-full border-[1.5px] border-divider bg-app px-4 py-3 transition-colors focus-within:border-accent-500 focus-within:ring-[3px] focus-within:ring-accent-200">
        {prefix && <span className="text-ink-muted">{prefix}</span>}
        <input
          className="w-full min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-muted"
          {...props}
        />
      </span>
    </label>
  );
}
