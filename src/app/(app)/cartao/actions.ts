"use server";

import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";
import { redirectWithToast } from "@/lib/toast";

type FormState = { error?: string } | undefined;

export async function createCard(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();

  const name = String(formData.get("name") || "Cartão").trim();
  const limitCents = parseMoneyToCents(formData.get("limit"));
  const closingDay = Number(formData.get("closing_day") || 15);
  const dueDay = Number(formData.get("due_day") || 5);

  const { error } = await supabase.from("credit_cards").insert({
    family_id: profile.family_id,
    name,
    limit_cents: limitCents,
    closing_day: closingDay,
    due_day: dueDay,
  });

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast("/cartao", "Cartão cadastrado!");
}

export async function updateCard(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();

  const cardId = String(formData.get("card_id"));
  const name = String(formData.get("name") || "Cartão").trim();
  const limitCents = parseMoneyToCents(formData.get("limit"));
  const closingDay = Number(formData.get("closing_day") || 15);
  const dueDay = Number(formData.get("due_day") || 5);

  const { error } = await supabase
    .from("credit_cards")
    .update({ name, limit_cents: limitCents, closing_day: closingDay, due_day: dueDay })
    .eq("id", cardId)
    .eq("family_id", profile.family_id);

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast("/cartao", "Cartão atualizado!");
}

export async function deleteCard(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const cardId = String(formData.get("card_id"));

  await supabase.from("credit_cards").delete().eq("id", cardId).eq("family_id", profile.family_id);

  redirectWithToast("/cartao", "Cartão excluído.");
}

export async function createPurchase(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();

  const cardId = String(formData.get("card_id"));
  const name = String(formData.get("name") || "").trim();
  const amountCents = parseMoneyToCents(formData.get("amount"));
  const installmentCurrent = Number(formData.get("installment_current") || 1);
  const installmentTotal = Number(formData.get("installment_total") || 1);

  const { data: card } = await supabase
    .from("credit_cards")
    .select("id")
    .eq("id", cardId)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!name || amountCents <= 0 || !card) {
    return { error: "Preencha os dados da compra." };
  }

  // amount_cents here is the per-installment value (that's what the form
  // asks for, and what the card's "used limit" bar multiplies by the
  // remaining installments) — the transaction ledger needs the full
  // commitment, same as an installment purchase logged via Lançar.
  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .insert({
      family_id: profile.family_id,
      user_id: profile.id,
      type: "saida",
      amount_cents: amountCents * installmentTotal,
      payment_method: "credito",
      installments: installmentTotal,
      occurred_at: new Date().toISOString().slice(0, 10),
      note: name,
    })
    .select("id")
    .single();

  if (transactionError || !transaction) {
    return { error: "Não foi possível salvar. Tente novamente." };
  }

  const { error } = await supabase.from("credit_card_purchases").insert({
    card_id: cardId,
    name,
    amount_cents: amountCents,
    installment_current: installmentCurrent,
    installment_start: installmentCurrent,
    installment_total: installmentTotal,
    transaction_id: transaction.id,
  });

  if (error) {
    await supabase.from("transactions").delete().eq("id", transaction.id);
    return { error: "Não foi possível salvar. Tente novamente." };
  }

  redirectWithToast("/cartao", "Compra adicionada!");
}

export async function deletePurchase(formData: FormData) {
  const { supabase } = await getSessionContext();
  const purchaseId = String(formData.get("purchase_id"));

  // RLS already scopes this to purchases on cards owned by the caller's family.
  const { data: purchase } = await supabase
    .from("credit_card_purchases")
    .select("transaction_id")
    .eq("id", purchaseId)
    .maybeSingle();

  if (purchase?.transaction_id) {
    await supabase.from("transactions").delete().eq("id", purchase.transaction_id);
  }

  await supabase.from("credit_card_purchases").delete().eq("id", purchaseId);

  redirectWithToast("/cartao", "Compra excluída.");
}
