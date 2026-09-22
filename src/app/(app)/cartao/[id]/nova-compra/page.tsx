import { notFound } from "next/navigation";
import { BackHeader } from "@/components/app/BackHeader";
import { getSessionContext } from "@/lib/session";
import { PurchaseForm } from "../../PurchaseForm";

export default async function NovaCompraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();

  const { data: card } = await supabase
    .from("credit_cards")
    .select("id, name")
    .eq("id", id)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!card) notFound();

  const { data: groups } = await supabase
    .from("budget_groups")
    .select("id, name")
    .eq("family_id", profile.family_id)
    .order("sort_order");

  return (
    <div>
      <BackHeader href={`/cartao/${card.id}`} label={card.name} />
      <h1 className="mb-5">Nova compra</h1>
      <PurchaseForm cardId={card.id} groups={groups ?? []} />
    </div>
  );
}
