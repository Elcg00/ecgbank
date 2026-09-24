import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold text-[15px] transition-colors disabled:opacity-45 disabled:pointer-events-none px-6 py-3.5";

const variants: Record<Variant, string> = {
  primary: "bg-accent-700 text-white hover:bg-accent-800",
  secondary: "border-2 border-accent-700 bg-transparent text-accent-ink hover:bg-accent-100",
  tertiary: "bg-accent-100 text-accent-ink hover:bg-accent-200",
  ghost: "bg-transparent text-accent-ink hover:underline px-0 py-0",
  danger: "bg-negative text-white hover:opacity-90",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
