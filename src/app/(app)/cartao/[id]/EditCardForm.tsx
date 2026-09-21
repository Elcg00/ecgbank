"use client";

import { useActionState } from "react";
import { updateCard, deleteCard } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

type Card = { id: string; name: string; closing_day: number; due_day: number };

export function EditCardForm({ card, defaultLimit }: { card: Card; defaultLimit: string }) {
  const [state, formAction, pending] = useActionState(updateCard, undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="card_id" value={card.id} />
        <Field label="Nome do cartão" name="name" defaultValue={card.name} required />
        <Field label="Limite" name="limit" inputMode="decimal" prefix="R$" defaultValue={defaultLimit} />
        <Field label="Dia de fechamento" name="closing_day" inputMode="numeric" defaultValue={String(card.closing_day)} />
        <Field label="Dia de vencimento" name="due_day" inputMode="numeric" defaultValue={String(card.due_day)} />
        {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </form>

      <ConfirmForm
        action={deleteCard}
        confirmMessage={`Excluir o cartão "${card.name}"? Todas as compras parceladas dele também serão removidas.`}
        className="mt-4"
      >
        <input type="hidden" name="card_id" value={card.id} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir cartão
        </Button>
      </ConfirmForm>
    </div>
  );
}
