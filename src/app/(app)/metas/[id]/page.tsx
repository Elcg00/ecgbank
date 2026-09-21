import { notFound } from "next/navigation";
import { getSessionContext } from "@/lib/session";
import { getGoals } from "@/lib/queries/goals";
import { BackHeader } from "@/components/app/BackHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { formatCents, centsToInputValue, monthsUntil } from "@/lib/format";
import { setContribution, updateGoal, deleteGoal } from "../actions";

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();
  const goals = await getGoals(supabase, profile.family_id);
  const goal = goals.find((g) => g.id === id);

  if (!goal) notFound();

  const pct = goal.target_cents > 0 ? Math.min(100, Math.round((goal.savedCents / goal.target_cents) * 100)) : 0;
  const months = monthsUntil(goal.deadline);
  const myContribution = goal.contributions.find((c) => c.userId === profile.id)?.amountCents ?? 0;

  return (
    <div>
      <BackHeader href="/metas" label="Metas" />
      <h1 className="mb-5">{goal.name}</h1>
      <Card className="mb-4 flex flex-col gap-3">
        <ProgressBar pct={pct} />
        <p className="text-[14px] text-ink-muted">
          {formatCents(goal.savedCents)} de {formatCents(goal.target_cents)}
          {goal.monthly_target_cents > 0 && ` · guarde ${formatCents(goal.monthly_target_cents)}/mês`}
          {months !== null && ` · ${months} ${months === 1 ? "mês" : "meses"} restantes`}
        </p>
        {goal.shared && goal.contributions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {goal.contributions.map((c) => (
              <span
                key={c.userId}
                className="rounded-full bg-surface-2 px-3 py-1 text-[12px] font-semibold text-ink-muted"
              >
                {c.name}: {formatCents(c.amountCents)}
              </span>
            ))}
          </div>
        )}
      </Card>

      <Card className="mb-4">
        <h5 className="mb-3">Quanto você já guardou</h5>
        <form action={setContribution} className="flex flex-col gap-4">
          <input type="hidden" name="goal_id" value={goal.id} />
          <Field
            label="Valor guardado por você"
            name="amount"
            inputMode="decimal"
            prefix="R$"
            defaultValue={centsToInputValue(myContribution)}
          />
          <Button type="submit">Salvar</Button>
        </form>
      </Card>

      <Card className="mb-4">
        <h5 className="mb-3">Editar meta</h5>
        <form action={updateGoal} className="flex flex-col gap-4">
          <input type="hidden" name="goal_id" value={goal.id} />
          <Field label="Nome da meta" name="name" defaultValue={goal.name} required />
          <Field
            label="Valor alvo"
            name="target"
            inputMode="decimal"
            prefix="R$"
            defaultValue={centsToInputValue(goal.target_cents)}
            required
          />
          <Field
            label="Guardar por mês"
            name="monthly_target"
            inputMode="decimal"
            prefix="R$"
            defaultValue={goal.monthly_target_cents > 0 ? centsToInputValue(goal.monthly_target_cents) : ""}
          />
          <Field label="Prazo" name="deadline" type="date" defaultValue={goal.deadline ?? ""} />
          <label className="flex items-center gap-2 text-[14px] font-semibold text-ink">
            <input type="checkbox" name="shared" defaultChecked={goal.shared} className="h-4 w-4 accent-accent-700" />
            Meta compartilhada com a família
          </label>
          <Button type="submit">Salvar alterações</Button>
        </form>
      </Card>

      <ConfirmForm action={deleteGoal} confirmMessage={`Excluir a meta "${goal.name}"?`}>
        <input type="hidden" name="goal_id" value={goal.id} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir meta
        </Button>
      </ConfirmForm>
    </div>
  );
}
