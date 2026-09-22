"use client";

import { useActionState } from "react";
import { createGroup } from "../actions";
import { Field } from "@/components/ui/Field";
import { MoneyField } from "@/components/ui/MoneyField";
import { Button } from "@/components/ui/Button";
import { SelectableCard } from "@/components/ui/SelectableCard";

export function GroupForm() {
  const [state, formAction, pending] = useActionState(createGroup, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Nome do grupo" name="name" required placeholder="Saúde" />
      <MoneyField label="Limite mensal (opcional)" name="limit" placeholder="0" />
      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-muted">Tipo</p>
        <div className="grid grid-cols-2 gap-3">
          <SelectableCard name="kind" value="spending" title="Gasto" defaultChecked />
          <SelectableCard name="kind" value="saving" title="Guardar" />
        </div>
      </div>
      {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando…" : "Criar grupo"}
      </Button>
    </form>
  );
}
