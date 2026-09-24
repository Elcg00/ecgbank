import { type ReactNode } from "react";

export function Card({
  children,
  className = "",
  tint = "surface",
}: {
  children: ReactNode;
  className?: string;
  tint?: "surface" | "surface-2" | "accent" | "accent2" | "dark";
}) {
  const bg =
    tint === "accent"
      ? "bg-accent-100 dark:bg-accent-900/40"
      : tint === "accent2"
        ? "bg-accent2-100 dark:bg-accent2-900/40"
        : tint === "surface-2"
          ? "bg-surface-2"
          : tint === "dark"
            ? "bg-accent-700 text-white"
            : "bg-surface";

  return (
    <div className={`rounded-card ${bg} p-5 shadow-sm ${className}`}>{children}</div>
  );
}
