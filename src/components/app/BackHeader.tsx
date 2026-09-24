import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BackHeader({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1 text-[14px] font-semibold text-ink-muted"
    >
      <ChevronLeft size={18} strokeWidth={2.25} />
      {label}
    </Link>
  );
}
