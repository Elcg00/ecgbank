import { notFound } from "next/navigation";
import { BackHeader } from "@/components/app/BackHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { getSessionContext } from "@/lib/session";
import { centsToInputValue } from "@/lib/format";
import { updateCard, deleteCard } from "../actions";

export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();

  const { data: card } = await supabase
    .from("credit_cards")
    .select("id, name, limit_cents, closing_day, due_day")
    .eq("id", id)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!card) notFound();

  return (
    <div>
      <BackHeader href="/cartao" label="Cartão de crédito" />
      <h1 className="mb-5">Editar cartão</h1>
      <form action={updateCard} className="flex flex-col gap-4">
        <input type="hidden" name="card_id" value={card.id} />
        <Field label="Nome do cartão" name="name" defaultValue={card.name} required />
        <Field
          label="Limite"
          name="limit"
          inputMode="decimal"
          prefix="R$"
          defaultValue={centsToInputValue(card.limit_cents)}
        />
        <Field label="Dia de fechamento" name="closing_day" inputMode="numeric" defaultValue={String(card.closing_day)} />
        <Field label="Dia de vencimento" name="due_day" inputMode="numeric" defaultValue={String(card.due_day)} />
        <Button type="submit">Salvar alterações</Button>
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
