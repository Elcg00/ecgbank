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

  const { data: members } = await supabase.from("profiles").select("id").eq("family_id", profile.family_id);
  const { data: incomes } = await supabase
    .from("onboarding_answers")
    .select("monthly_income_cents")
    .in("user_id", (members ?? []).map((m) => m.id));
  const familyIncomeCents = (incomes ?? []).reduce((s, i) => s + i.monthly_income_cents, 0);

  return (
    <div>
      <PageHeader title="Orçamento" name={profile.full_name} />
      <PlanTabs active="/orcamento" />
      {familyIncomeCents > 0 && (
        <Card className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[13px] text-ink-muted">Renda familiar estimada</p>
            <h4>{formatCents(familyIncomeCents)}/mês</h4>
          </div>
          <Link href="/configuracoes" className="text-[13px] font-semibold text-accent-ink">
            editar
          </Link>
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
