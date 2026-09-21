import Link from "next/link";
import { Plus } from "lucide-react";
import { desktopNav } from "@/lib/nav";
import { NavLink } from "./NavLink";
import { Monogram } from "@/components/ui/Monogram";

export function Sidebar({ familyName, memberName }: { familyName: string; memberName: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[248px] flex-col border-r border-divider bg-surface px-4 py-6 md:flex">
      <span className="mb-6 px-3 font-heading text-xl text-accent-ink">ECG BANK</span>
      <Link
        href="/lancar"
        className="mb-6 flex items-center justify-center gap-2 rounded-full bg-accent-700 px-4 py-3 text-[15px] font-semibold text-white hover:bg-accent-800"
      >
        <Plus size={18} strokeWidth={2.75} />
        Lançar
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {desktopNav.map((item) => (
          <NavLink key={item.href} item={item} variant="sidebar" />
        ))}
      </nav>
      <div className="flex items-center gap-3 rounded-2xl bg-surface-2 px-3 py-3">
        <Monogram label={memberName} />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-ink">{memberName}</p>
          <p className="truncate text-[12px] text-ink-muted">{familyName}</p>
        </div>
      </div>
    </aside>
  );
}
