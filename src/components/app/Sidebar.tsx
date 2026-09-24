import Link from "next/link";
import { Plus } from "lucide-react";
import { desktopNav } from "@/lib/nav";
import { NavLink } from "./NavLink";
import { Monogram } from "@/components/ui/Monogram";

export function Sidebar({
  familyName,
  memberName,
  avatarColor,
  overdueBillsCount,
}: {
  familyName: string;
  memberName: string;
  avatarColor?: string;
  overdueBillsCount?: number;
}) {
  return (
    <aside
      className="fixed inset-y-0 left-0 hidden w-[248px] flex-col bg-accent-700 px-4 py-6 md:flex"
      style={{ backgroundImage: "url(/brand/fundos/padrao-pulso-escuro.svg)", backgroundRepeat: "repeat" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG, no Image optimization needed */}
      <img src="/brand/logo/ecg-bank-horizontal-branco.svg" alt="ECG Bank" className="mb-6 h-8 w-auto px-3" />
      <Link
        href="/lancar"
        className="mb-6 flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-[15px] font-bold text-accent-700 hover:bg-accent-100"
      >
        <Plus size={18} strokeWidth={2.25} />
        Lançar
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {desktopNav.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={<item.icon size={18} strokeWidth={2.25} />}
            variant="sidebar"
            badge={item.href === "/contas" ? overdueBillsCount : undefined}
          />
        ))}
      </nav>
      <Link
        href="/configuracoes"
        className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3 hover:bg-white/15"
      >
        <Monogram label={memberName} color={avatarColor} />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-white">{memberName}</p>
          <p className="truncate text-[12px] text-[#CFE0D3]">{familyName}</p>
        </div>
      </Link>
    </aside>
  );
}
