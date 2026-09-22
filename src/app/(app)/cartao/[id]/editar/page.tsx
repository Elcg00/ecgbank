import { notFound } from "next/navigation";
import { BackHeader } from "@/components/app/BackHeader";
import { getSessionContext } from "@/lib/session";
import { centsToInputValue } from "@/lib/format";
import { EditCardForm } from "../EditCardForm";

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
      <BackHeader href={`/cartao/${card.id}`} label={card.name} />
      <h1 className="mb-5">Editar cartão</h1>
      <EditCardForm card={card} defaultLimit={centsToInputValue(card.limit_cents)} />
    </div>
  );
}
