import Link from "next/link";
import { planTabs } from "@/lib/nav";

export function PlanTabs({ active }: { active: "/orcamento" | "/metas" | "/dividas" }) {
  return (
    <div className="mb-5 inline-flex gap-1 rounded-full bg-surface-2 p-1 md:hidden">
      {planTabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
            active === tab.href ? "bg-accent-700 text-white" : "text-ink-muted"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
