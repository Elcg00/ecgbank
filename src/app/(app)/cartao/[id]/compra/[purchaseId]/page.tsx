import { notFound } from "next/navigation";
import { BackHeader } from "@/components/app/BackHeader";
import { getSessionContext } from "@/lib/session";
import { centsToInputValue } from "@/lib/format";
import { EditPurchaseForm } from "./EditPurchaseForm";

export default async function EditPurchasePage({
  params,
}: {
  params: Promise<{ id: string; purchaseId: string }>;
}) {
  const { id, purchaseId } = await params;
  const { supabase, profile } = await getSessionContext();

  const { data: card } = await supabase
    .from("credit_cards")
    .select("id, name")
    .eq("id", id)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!card) notFound();

  const { data: purchase } = await supabase
    .from("credit_card_purchases")
    .select("id, name, amount_cents, installment_current, installment_total, budget_group_id")
    .eq("id", purchaseId)
    .eq("card_id", card.id)
    .maybeSingle();

  if (!purchase) notFound();

  const { data: groups } = await supabase
    .from("budget_groups")
    .select("id, name")
    .eq("family_id", profile.family_id)
    .order("sort_order");

  const totalCents = purchase.amount_cents * purchase.installment_total;

  return (
    <div>
      <BackHeader href={`/cartao/${card.id}`} label={card.name} />
      <h1 className="mb-5">Editar compra</h1>
      <EditPurchaseForm
        cardId={card.id}
        purchase={purchase}
        groups={groups ?? []}
        defaultAmount={centsToInputValue(totalCents)}
      />
    </div>
  );
}
