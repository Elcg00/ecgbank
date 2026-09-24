"use client";

import { useActionState, useState } from "react";
import { updateTransaction, deleteTransaction } from "../actions";
import { Field } from "@/components/ui/Field";
import { MoneyField } from "@/components/ui/MoneyField";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { SelectableChip } from "@/components/ui/SelectableChip";

const INCOME_SOURCES = [
  { value: "salario", label: "Salário" },
  { value: "extra", label: "Renda extra" },
  { value: "reembolso", label: "Reembolso" },
  { value: "outro", label: "Outro" },
];

type Transaction = {
  id: string;
  type: string;
  amount_cents: number;
  budget_group_id: string | null;
  income_source: string | null;
  note: string | null;
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
  const [type, setType] = useState(transaction.type);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={transaction.id} />
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink-muted">Tipo</p>
          <div className="flex gap-2" onChange={(e) => setType((e.target as HTMLInputElement).value)}>
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
        <MoneyField label="Valor" name="amount" defaultValue={defaultAmount} required />
        {type === "saida" && groups.length > 0 && (
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
        {type === "entrada" && (
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink-muted">Origem</p>
            <div className="flex flex-wrap gap-2">
              {INCOME_SOURCES.map((s) => (
                <SelectableChip
                  key={s.value}
                  name="income_source"
                  value={s.value}
                  label={s.label}
                  type="radio"
                  defaultChecked={transaction.income_source === s.value}
                />
              ))}
            </div>
          </div>
        )}
        <Field label="Nota (opcional)" name="note" defaultValue={transaction.note ?? ""} placeholder="Ex: aniversário da Maria" />
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
        <Button type="submit" variant="danger" className="w-full">
          Excluir lançamento
        </Button>
      </ConfirmForm>
    </div>
  );
}
