"use client";

import { useActionState } from "react";
import { createBill } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function BillForm() {
  const [state, formAction, pending] = useActionState(createBill, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Nome da conta" name="name" required placeholder="Aluguel" />
      <Field label="Valor" name="amount" inputMode="decimal" prefix="R$" required placeholder="1.200" />
      <Field label="Vencimento" name="due_date" type="date" required />
      <label className="flex items-center gap-2 text-[14px] font-semibold text-ink">
        <input type="checkbox" name="recurring" className="h-4 w-4 accent-accent-700" />
        Conta recorrente (repete todo mês)
      </label>
      {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando…" : "Adicionar conta"}
      </Button>
    </form>
  );
}
