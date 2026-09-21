import { notFound } from "next/navigation";
import { getSessionContext } from "@/lib/session";
import { getMonthSummary, getBudgetGroups, groupStatusLabel } from "@/lib/queries/dashboard";
import { BackHeader } from "@/components/app/BackHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { formatCents, centsToInputValue } from "@/lib/format";
import { updateGroup, deleteGroup } from "../actions";

export default async function BudgetGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();
  const { spentByGroup } = await getMonthSummary(supabase, profile.family_id);
  const groups = await getBudgetGroups(supabase, profile.family_id, spentByGroup);
  const group = groups.find((g) => g.id === id);

  if (!group) notFound();

  return (
    <div>
      <BackHeader href="/orcamento" label="Orçamento" />
      <h1 className="mb-5">{group.name}</h1>
      <Card className="mb-4 flex flex-col gap-3">
        <ProgressBar pct={group.limitCents > 0 ? group.pct : 0} />
        <p className="text-[14px] text-ink-muted">
          {formatCents(group.spentCents)}
          {group.limitCents > 0 && ` de ${formatCents(group.limitCents)}`} gastos este mês
        </p>
        {group.limitCents > 0 && (
          <p className="text-[14px] font-semibold text-ink">
            {groupStatusLabel(group.status, group.pct, group.kind)}
          </p>
        )}
      </Card>
      <Card className="mb-4">
        <h5 className="mb-3">Editar grupo</h5>
        <form action={updateGroup} className="flex flex-col gap-4">
          <input type="hidden" name="group_id" value={group.id} />
          <Field label="Nome" name="name" defaultValue={group.name} required />
          <Field
            label="Limite mensal"
            name="limit"
            inputMode="decimal"
            prefix="R$"
            defaultValue={group.limitCents > 0 ? centsToInputValue(group.limitCents) : ""}
            placeholder="0"
          />
          <Button type="submit">Salvar alterações</Button>
        </form>
      </Card>
      <ConfirmForm
        action={deleteGroup}
        confirmMessage={`Excluir o grupo "${group.name}"? Os lançamentos já feitos continuam no extrato, só perdem a categoria.`}
      >
        <input type="hidden" name="group_id" value={group.id} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir grupo
        </Button>
      </ConfirmForm>
    </div>
  );
}
