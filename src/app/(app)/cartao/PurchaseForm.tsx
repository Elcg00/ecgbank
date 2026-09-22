"use client";

import { useActionState } from "react";
import { createPurchase } from "./actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function PurchaseForm({ cardId }: { cardId: string }) {
  const [state, formAction, pending] = useActionState(createPurchase, undefined);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="card_id" value={cardId} />
      <Field label="Nome da compra" name="name" required placeholder="Notebook" />
      <Field label="Valor total da compra" name="amount" inputMode="decimal" prefix="R$" required placeholder="2.500" />
      <Field label="Parcela atual" name="installment_current" inputMode="numeric" placeholder="4" defaultValue="1" />
      <Field label="Total de parcelas" name="installment_total" inputMode="numeric" placeholder="10" defaultValue="1" />
      {state?.error && <p className="text-[14px] text-negative sm:col-span-2">{state.error}</p>}
      <Button type="submit" disabled={pending} className="sm:col-span-2">
        {pending ? "Salvando…" : "Adicionar compra"}
      </Button>
    </form>
  );
}
