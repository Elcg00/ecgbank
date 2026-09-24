"use client";

import { useActionState } from "react";
import { updateBill, deleteBill } from "../actions";
import { Field } from "@/components/ui/Field";
import { MoneyField } from "@/components/ui/MoneyField";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

type Bill = {
  id: string;
  name: string;
  amount_cents: number;
  due_date: string;
  recurring: boolean;
  budget_group_id: string | null;
};
type Group = { id: string; name: string };

export function EditBillForm({
  bill,
  groups,
  defaultAmount,
}: {
  bill: Bill;
  groups: Group[];
  defaultAmount: string;
}) {
  const [state, formAction, pending] = useActionState(updateBill, undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="bill_id" value={bill.id} />
        <Field label="Nome da conta" name="name" defaultValue={bill.name} required />
        <MoneyField label="Valor" name="amount" defaultValue={defaultAmount} required />
        <Field label="Vencimento" name="due_date" type="date" defaultValue={bill.due_date} required />
        {groups.length > 0 && (
          <Select label="Categoria (opcional)" name="budget_group_id" defaultValue={bill.budget_group_id ?? ""}>
            <option value="">Sem categoria</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        )}
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
        <Button type="submit" variant="danger" className="w-full">
          Excluir conta
        </Button>
      </ConfirmForm>
    </div>
  );
}
