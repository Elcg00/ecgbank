"use server";

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";

function toCents(value: FormDataEntryValue | null) {
  return Number(String(value || "0").replace(/\D/g, "")) * 100;
}

export async function createCard(formData: FormData) {
  const { supabase, profile } = await getSessionContext();

  const name = String(formData.get("name") || "Cartão").trim();
  const limitCents = toCents(formData.get("limit"));
  const closingDay = Number(formData.get("closing_day") || 15);
  const dueDay = Number(formData.get("due_day") || 5);

  await supabase.from("credit_cards").insert({
    family_id: profile.family_id,
    name,
    limit_cents: limitCents,
    closing_day: closingDay,
    due_day: dueDay,
  });

  redirect("/cartao");
}

export async function createPurchase(formData: FormData) {
  const { supabase, profile } = await getSessionContext();

  const cardId = String(formData.get("card_id"));
  const name = String(formData.get("name") || "").trim();
  const amountCents = toCents(formData.get("amount"));
  const installmentCurrent = Number(formData.get("installment_current") || 1);
  const installmentTotal = Number(formData.get("installment_total") || 1);

  const { data: card } = await supabase
    .from("credit_cards")
    .select("id")
    .eq("id", cardId)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!name || amountCents <= 0 || !card) {
    throw new Error("Preencha os dados da compra.");
  }

  await supabase.from("credit_card_purchases").insert({
    card_id: cardId,
    name,
    amount_cents: amountCents,
    installment_current: installmentCurrent,
    installment_total: installmentTotal,
  });

  redirect("/cartao");
}
