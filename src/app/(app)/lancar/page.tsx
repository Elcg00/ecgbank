import Link from "next/link";
import { X } from "lucide-react";
import { getSessionContext } from "@/lib/session";
import { LancarForm } from "./LancarForm";

export default async function LancarPage() {
  const { supabase, profile } = await getSessionContext();

  const [{ data: groups }, { data: members }] = await Promise.all([
    supabase
      .from("budget_groups")
      .select("id, name")
      .eq("family_id", profile.family_id)
      .order("sort_order"),
    supabase.from("profiles").select("id, full_name").eq("family_id", profile.family_id),
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center md:items-center md:bg-ink/40 md:backdrop-blur-sm">
      <div className="flex min-h-dvh w-full flex-col bg-app px-5 pb-10 pt-6 md:min-h-0 md:max-h-[85vh] md:w-[480px] md:overflow-y-auto md:rounded-card md:px-7 md:py-7 md:shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h3>Nova movimentação</h3>
          <Link href="/" aria-label="Fechar" className="text-ink-muted">
            <X size={22} strokeWidth={2.75} />
          </Link>
        </div>
        <LancarForm
          categories={(groups ?? []).map((g) => ({ id: g.id, name: g.name }))}
          members={(members ?? []).map((m) => ({ id: m.id, name: m.full_name || "Você" }))}
        />
      </div>
    </div>
  );
}
