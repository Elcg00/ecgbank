"use client";

import { useActionState } from "react";
import { createGoal } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function GoalForm() {
  const [state, formAction, pending] = useActionState(createGoal, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Nome da meta" name="name" required placeholder="Reserva de emergência" />
      <Field label="Valor alvo" name="target" inputMode="decimal" prefix="R$" required placeholder="3.000" />
      <Field label="Guardar por mês" name="monthly_target" inputMode="decimal" prefix="R$" placeholder="225" />
      <Field label="Prazo" name="deadline" type="date" />
      <label className="flex items-center gap-2 text-[14px] font-semibold text-ink">
        <input type="checkbox" name="shared" defaultChecked className="h-4 w-4 accent-accent-700" />
        Meta compartilhada com a família
      </label>
      {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando…" : "Criar meta"}
      </Button>
    </form>
  );
}
