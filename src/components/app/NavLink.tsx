"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function NavLink({
  href,
  label,
  icon,
  variant,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  variant: "sidebar" | "bottom";
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (variant === "bottom") {
    return (
      <Link
        href={href}
        className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-semibold ${
          active ? "text-accent-ink" : "text-ink-muted"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
        active ? "bg-surface-2 text-accent-ink" : "text-ink-muted hover:text-ink"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-accent-700" : "bg-transparent"}`}
        aria-hidden
      />
      {icon}
      {label}
    </Link>
  );
}
