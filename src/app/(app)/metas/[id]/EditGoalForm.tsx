"use client";

import { useActionState } from "react";
import { updateGoal, deleteGoal } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

type Goal = {
  id: string;
  name: string;
  deadline: string | null;
  shared: boolean;
};

export function EditGoalForm({
  goal,
  defaultTarget,
  defaultMonthlyTarget,
}: {
  goal: Goal;
  defaultTarget: string;
  defaultMonthlyTarget: string;
}) {
  const [state, formAction, pending] = useActionState(updateGoal, undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="goal_id" value={goal.id} />
        <Field label="Nome da meta" name="name" defaultValue={goal.name} required />
        <Field
          label="Valor alvo"
          name="target"
          inputMode="decimal"
          prefix="R$"
          defaultValue={defaultTarget}
          required
        />
        <Field
          label="Guardar por mês"
          name="monthly_target"
          inputMode="decimal"
          prefix="R$"
          defaultValue={defaultMonthlyTarget}
        />
        <Field label="Prazo" name="deadline" type="date" defaultValue={goal.deadline ?? ""} />
        <label className="flex items-center gap-2 text-[14px] font-semibold text-ink">
          <input type="checkbox" name="shared" defaultChecked={goal.shared} className="h-4 w-4 accent-accent-700" />
          Meta compartilhada com a família
        </label>
        {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </form>

      <ConfirmForm action={deleteGoal} confirmMessage={`Excluir a meta "${goal.name}"?`} className="mt-4">
        <input type="hidden" name="goal_id" value={goal.id} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir meta
        </Button>
      </ConfirmForm>
    </div>
  );
}
