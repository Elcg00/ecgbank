import Link from "next/link";
import { Plus } from "lucide-react";
import { getSessionContext } from "@/lib/session";
import { getMonthSummary, getBudgetGroups } from "@/lib/queries/dashboard";
import { PageHeader } from "@/components/app/PageHeader";
import { PlanTabs } from "@/components/app/PlanTabs";
import { GroupRow } from "@/components/app/GroupRow";
import { Card } from "@/components/ui/Card";
import { formatCents } from "@/lib/format";

export default async function OrcamentoPage() {
  const { supabase, profile } = await getSessionContext();
  const { spentByGroup } = await getMonthSummary(supabase, profile.family_id);
  const groups = await getBudgetGroups(supabase, profile.family_id, spentByGroup);

  const { data: members } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("family_id", profile.family_id);
  const { data: incomes } = await supabase
    .from("onboarding_answers")
    .select("user_id, monthly_income_cents")
    .in("user_id", (members ?? []).map((m) => m.id));
  const incomeByUser = new Map((incomes ?? []).map((i) => [i.user_id, i.monthly_income_cents]));
  const incomeBreakdown = (members ?? [])
    .map((m) => ({
      name: m.id === profile.id ? "Você" : m.full_name || "Membro",
      cents: incomeByUser.get(m.id) ?? 0,
    }))
    .filter((m) => m.cents > 0);
  const familyIncomeCents = incomeBreakdown.reduce((s, m) => s + m.cents, 0);

  return (
    <div>
      <PageHeader title="Orçamento" name={profile.full_name} avatarColor={profile.avatar_color} />
      <PlanTabs active="/orcamento" />
      {familyIncomeCents > 0 && (
        <Card className="mb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[13px] text-ink-muted">Renda familiar estimada</p>
              <h4>{formatCents(familyIncomeCents)}/mês</h4>
            </div>
            <Link href="/configuracoes" className="text-[13px] font-semibold text-accent-ink">
              editar
            </Link>
          </div>
          {incomeBreakdown.length > 1 && (
            <div className="mt-3 flex flex-col gap-1 border-t border-divider pt-3">
              {incomeBreakdown.map((m) => (
                <div key={m.name} className="flex items-center justify-between text-[13px] text-ink-muted">
                  <span>{m.name}</span>
                  <span className="font-semibold text-ink">{formatCents(m.cents)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
      <div className="mb-4 flex justify-end">
        <Link href="/orcamento/nova" className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink">
          <Plus size={16} strokeWidth={2.75} /> Novo grupo
        </Link>
      </div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
        {groups.map((g) => (
          <GroupRow key={g.id} group={g} />
        ))}
        {groups.length === 0 && (
          <Card className="text-[14px] text-ink-muted">Nenhum grupo de orçamento ainda.</Card>
        )}
      </div>
    </div>
  );
}
