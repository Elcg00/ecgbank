"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/nav";

export function NavLink({ item, variant }: { item: NavItem; variant: "sidebar" | "bottom" }) {
  const pathname = usePathname();
  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const Icon = item.icon;

  if (variant === "bottom") {
    return (
      <Link
        href={item.href}
        className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-semibold ${
          active ? "text-accent-ink" : "text-ink-muted"
        }`}
      >
        <Icon size={22} strokeWidth={2.75} />
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
        active ? "bg-surface-2 text-accent-ink" : "text-ink-muted hover:text-ink"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-accent-700" : "bg-transparent"}`}
        aria-hidden
      />
      <Icon size={18} strokeWidth={2.75} />
      {item.label}
    </Link>
  );
}
