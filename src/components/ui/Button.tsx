import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-[15px] transition-colors disabled:opacity-50 disabled:pointer-events-none px-6 py-3";

const variants: Record<Variant, string> = {
  primary: "bg-accent-700 text-white hover:bg-accent-800",
  secondary:
    "bg-transparent border border-divider text-ink hover:bg-surface-2",
  ghost: "bg-transparent text-accent-ink hover:underline px-0 py-0",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
