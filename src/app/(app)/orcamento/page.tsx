import { getSessionContext } from "@/lib/session";
import { getMonthSummary, getBudgetGroups } from "@/lib/queries/dashboard";
import { PageHeader } from "@/components/app/PageHeader";
import { PlanTabs } from "@/components/app/PlanTabs";
import { GroupRow } from "@/components/app/GroupRow";
import { Card } from "@/components/ui/Card";

export default async function OrcamentoPage() {
  const { supabase, profile } = await getSessionContext();
  const { spentByGroup } = await getMonthSummary(supabase, profile.family_id);
  const groups = await getBudgetGroups(supabase, profile.family_id, spentByGroup);

  return (
    <div>
      <PageHeader title="Orçamento" name={profile.full_name} />
      <PlanTabs active="/orcamento" />
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
