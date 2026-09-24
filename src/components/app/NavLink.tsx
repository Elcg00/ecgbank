"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CountBadge } from "@/components/ui/CountBadge";

export function NavLink({
  href,
  label,
  icon,
  variant,
  badge,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  variant: "sidebar" | "bottom";
  badge?: number;
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
        <span className="relative">
          {icon}
          <CountBadge count={badge ?? 0} className="absolute -right-1.5 -top-1.5 h-4 min-w-4 px-1 text-[10px]" />
        </span>
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
        active ? "bg-white/12 text-white" : "text-[#CFE0D3] hover:text-white"
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      <CountBadge count={badge ?? 0} className="h-5 min-w-5 px-1.5 text-[11px]" />
    </Link>
  );
}
