"use client";

import { useActionState } from "react";
import { updateIncome } from "./actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function IncomeForm({ defaultIncome }: { defaultIncome: string }) {
  const [state, formAction, pending] = useActionState(updateIncome, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Field label="Sua renda mensal" name="income" inputMode="decimal" prefix="R$" defaultValue={defaultIncome} />
      {state?.error && <p className="text-[13px] text-negative">{state.error}</p>}
      {state?.saved && <p className="text-[13px] text-positive">Renda atualizada!</p>}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Salvando…" : "Salvar renda"}
      </Button>
    </form>
  );
}
