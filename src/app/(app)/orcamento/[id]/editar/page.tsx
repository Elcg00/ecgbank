import { notFound } from "next/navigation";
import { getSessionContext } from "@/lib/session";
import { getMonthSummary, getBudgetGroups } from "@/lib/queries/dashboard";
import { BackHeader } from "@/components/app/BackHeader";
import { centsToInputValue } from "@/lib/format";
import { EditGroupForm } from "../EditGroupForm";

export default async function EditBudgetGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();
  const { spentByGroup } = await getMonthSummary(supabase, profile.family_id);
  const groups = await getBudgetGroups(supabase, profile.family_id, spentByGroup);
  const group = groups.find((g) => g.id === id);

  if (!group) notFound();

  return (
    <div>
      <BackHeader href={`/orcamento/${group.id}`} label={group.name} />
      <h1 className="mb-5">Editar grupo</h1>
      <EditGroupForm
        groupId={group.id}
        name={group.name}
        defaultLimit={group.limitCents > 0 ? centsToInputValue(group.limitCents) : ""}
      />
    </div>
  );
}
