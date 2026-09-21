import Link from "next/link";
import { Plus } from "lucide-react";
import { getSessionContext } from "@/lib/session";
import { getGoals } from "@/lib/queries/goals";
import { PageHeader } from "@/components/app/PageHeader";
import { PlanTabs } from "@/components/app/PlanTabs";
import { GoalCard } from "@/components/app/GoalCard";
import { Card } from "@/components/ui/Card";

export default async function MetasPage() {
  const { supabase, profile } = await getSessionContext();
  const goals = await getGoals(supabase, profile.family_id);

  return (
    <div>
      <PageHeader title="Metas" name={profile.full_name} />
      <PlanTabs active="/metas" />
      <div className="mb-4 flex justify-end">
        <Link href="/metas/nova" className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink">
          <Plus size={16} strokeWidth={2.75} /> Nova meta
        </Link>
      </div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
        {goals.length === 0 && (
          <Card className="text-[14px] text-ink-muted">Nenhuma meta ainda. Crie a primeira!</Card>
        )}
      </div>
    </div>
  );
}
