import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { maisMenu } from "@/lib/nav";
import { PageHeader } from "@/components/app/PageHeader";
import { getSessionContext } from "@/lib/session";

export default async function MaisPage() {
  const { profile } = await getSessionContext();

  return (
    <div>
      <PageHeader title="Mais" name={profile.full_name} />
      <div className="overflow-hidden rounded-card bg-surface shadow-sm">
        {maisMenu.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-5 py-4 ${
              i > 0 ? "border-t border-divider" : ""
            }`}
          >
            <item.icon size={20} strokeWidth={2.75} className="text-accent-ink" />
            <span className="flex-1 font-semibold">{item.label}</span>
            <ChevronRight size={18} className="text-ink-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
