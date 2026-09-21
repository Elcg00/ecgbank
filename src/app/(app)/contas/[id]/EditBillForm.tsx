"use client";

import { useActionState } from "react";
import { updateBill, deleteBill } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

type Bill = { id: string; name: string; amount_cents: number; due_date: string; recurring: boolean };

export function EditBillForm({ bill, defaultAmount }: { bill: Bill; defaultAmount: string }) {
  const [state, formAction, pending] = useActionState(updateBill, undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="bill_id" value={bill.id} />
        <Field label="Nome da conta" name="name" defaultValue={bill.name} required />
        <Field label="Valor" name="amount" inputMode="decimal" prefix="R$" defaultValue={defaultAmount} required />
        <Field label="Vencimento" name="due_date" type="date" defaultValue={bill.due_date} required />
        <label className="flex items-center gap-2 text-[14px] font-semibold text-ink">
          <input type="checkbox" name="recurring" defaultChecked={bill.recurring} className="h-4 w-4 accent-accent-700" />
          Conta recorrente (repete todo mês)
        </label>
        {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </form>

      <ConfirmForm action={deleteBill} confirmMessage={`Excluir a conta "${bill.name}"?`} className="mt-4">
        <input type="hidden" name="bill_id" value={bill.id} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir conta
        </Button>
      </ConfirmForm>
    </div>
  );
}
