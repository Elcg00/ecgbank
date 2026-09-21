"use client";

import { useActionState } from "react";
import { updateTransaction, deleteTransaction } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { SelectableChip } from "@/components/ui/SelectableChip";

type Transaction = {
  id: string;
  type: string;
  amount_cents: number;
  budget_group_id: string | null;
  occurred_at: string;
};

export function EditTransactionForm({
  transaction,
  groups,
  defaultAmount,
}: {
  transaction: Transaction;
  groups: { id: string; name: string }[];
  defaultAmount: string;
}) {
  const [state, formAction, pending] = useActionState(updateTransaction, undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={transaction.id} />
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink-muted">Tipo</p>
          <div className="flex gap-2">
            <SelectableChip
              name="type"
              value="entrada"
              label="Entrada"
              type="radio"
              defaultChecked={transaction.type === "entrada"}
            />
            <SelectableChip
              name="type"
              value="saida"
              label="Saída"
              type="radio"
              defaultChecked={transaction.type === "saida"}
            />
          </div>
        </div>
        <Field label="Valor" name="amount" inputMode="decimal" prefix="R$" defaultValue={defaultAmount} required />
        {groups.length > 0 && (
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink-muted">Categoria</p>
            <div className="flex flex-wrap gap-2">
              {groups.map((g) => (
                <SelectableChip
                  key={g.id}
                  name="budget_group_id"
                  value={g.id}
                  label={g.name}
                  type="radio"
                  defaultChecked={transaction.budget_group_id === g.id}
                />
              ))}
            </div>
          </div>
        )}
        <Field label="Data" name="occurred_at" type="date" defaultValue={transaction.occurred_at} />
        {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </form>

      <ConfirmForm
        action={deleteTransaction}
        confirmMessage="Excluir este lançamento? Essa ação não pode ser desfeita."
        className="mt-4"
      >
        <input type="hidden" name="id" value={transaction.id} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir lançamento
        </Button>
      </ConfirmForm>
    </div>
  );
}
