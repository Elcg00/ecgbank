import { notFound } from "next/navigation";
import { getSessionContext } from "@/lib/session";
import { getGoals } from "@/lib/queries/goals";
import { BackHeader } from "@/components/app/BackHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { formatCents, monthsUntil } from "@/lib/format";
import { addContribution } from "../actions";

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();
  const goals = await getGoals(supabase, profile.family_id);
  const goal = goals.find((g) => g.id === id);

  if (!goal) notFound();

  const pct = goal.target_cents > 0 ? Math.min(100, Math.round((goal.savedCents / goal.target_cents) * 100)) : 0;
  const months = monthsUntil(goal.deadline);

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
                key={c.name}
                className="rounded-full bg-surface-2 px-3 py-1 text-[12px] font-semibold text-ink-muted"
              >
                {c.name}: {formatCents(c.amountCents)}
              </span>
            ))}
          </div>
        )}
      </Card>
      <Card>
        <h5 className="mb-3">Guardar mais</h5>
        <form action={addContribution} className="flex flex-col gap-4">
          <input type="hidden" name="goal_id" value={goal.id} />
          <Field label="Quanto você quer guardar agora?" name="amount" inputMode="numeric" prefix="R$" placeholder="100" />
          <Button type="submit">Guardar</Button>
        </form>
      </Card>
    </div>
  );
}
