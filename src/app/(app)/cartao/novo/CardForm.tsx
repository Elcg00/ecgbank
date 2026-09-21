"use client";

import { useActionState } from "react";
import { createCard } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function CardForm() {
  const [state, formAction, pending] = useActionState(createCard, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Nome do cartão" name="name" placeholder="Cartão" defaultValue="Cartão" />
      <Field label="Limite" name="limit" inputMode="decimal" prefix="R$" placeholder="3.000" />
      <Field label="Dia de fechamento" name="closing_day" inputMode="numeric" placeholder="15" defaultValue="15" />
      <Field label="Dia de vencimento" name="due_day" inputMode="numeric" placeholder="5" defaultValue="5" />
      {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando…" : "Cadastrar cartão"}
      </Button>
    </form>
  );
}
