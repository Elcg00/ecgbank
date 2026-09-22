"use client";

import { useActionState } from "react";
import { createGoal } from "../actions";
import { Field } from "@/components/ui/Field";
import { MoneyField } from "@/components/ui/MoneyField";
import { Button } from "@/components/ui/Button";

export function GoalForm({ defaultName }: { defaultName?: string }) {
  const [state, formAction, pending] = useActionState(createGoal, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Nome da meta"
        name="name"
        required
        placeholder="Reserva de emergência"
        defaultValue={defaultName}
      />
      <MoneyField label="Valor alvo" name="target" required placeholder="3.000" />
      <MoneyField label="Guardar por mês" name="monthly_target" placeholder="225" />
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
