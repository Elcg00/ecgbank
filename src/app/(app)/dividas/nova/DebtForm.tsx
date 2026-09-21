"use client";

import { useActionState } from "react";
import { createDebt } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function DebtForm() {
  const [state, formAction, pending] = useActionState(createDebt, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Nome da dívida" name="name" required placeholder="Cartão antigo" />
      <Field label="Valor restante" name="remaining" inputMode="decimal" prefix="R$" required placeholder="1.800" />
      <Field label="Juros ao mês (%)" name="interest_rate" inputMode="decimal" placeholder="12,5" />
      <Field label="Número de parcelas" name="installment_count" inputMode="numeric" placeholder="6" />
      <Field
        label="Valor da parcela"
        name="installment_amount"
        inputMode="decimal"
        prefix="R$"
        placeholder="346"
      />
      {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando…" : "Adicionar dívida"}
      </Button>
    </form>
  );
}
