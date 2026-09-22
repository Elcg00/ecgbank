"use client";

import { useActionState } from "react";
import { createBill } from "../actions";
import { Field } from "@/components/ui/Field";
import { MoneyField } from "@/components/ui/MoneyField";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type Group = { id: string; name: string };

export function BillForm({ groups }: { groups: Group[] }) {
  const [state, formAction, pending] = useActionState(createBill, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Nome da conta" name="name" required placeholder="Aluguel" />
      <MoneyField label="Valor" name="amount" required placeholder="1.200" />
      <Field label="Vencimento" name="due_date" type="date" required />
      {groups.length > 0 && (
        <Select label="Categoria (opcional)" name="budget_group_id" defaultValue="">
          <option value="">Sem categoria</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </Select>
      )}
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
