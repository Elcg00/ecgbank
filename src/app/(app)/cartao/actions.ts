"use server";

import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";
import { redirectWithToast } from "@/lib/toast";

type FormState = { error?: string } | undefined;

function clampInstallments(currentRaw: number, totalRaw: number) {
  const total = Math.max(1, Math.floor(totalRaw) || 1);
  const current = Math.min(total, Math.max(1, Math.floor(currentRaw) || 1));
  return { current, total };
}

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

  redirectWithToast(`/cartao/${cardId}`, "Cartão atualizado!");
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
  const totalCents = parseMoneyToCents(formData.get("amount"));
  const { current: installmentCurrent, total: installmentTotal } = clampInstallments(
    Number(formData.get("installment_current")),
    Number(formData.get("installment_total")),
  );
  const budgetGroupId = String(formData.get("budget_group_id") || "") || null;

  const { data: card } = await supabase
    .from("credit_cards")
    .select("id")
    .eq("id", cardId)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!name || totalCents <= 0 || !card) {
    return { error: "Preencha os dados da compra." };
  }

  // The form asks for the purchase's total price; only one installment's
  // worth should hit this month's balance, and the rest lands one at a
  // time as rollCardInstallments advances installment_current each month.
  const installmentAmountCents = Math.round(totalCents / installmentTotal);
  const todayIso = new Date().toISOString().slice(0, 10);

  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .insert({
      family_id: profile.family_id,
      user_id: profile.id,
      type: "saida",
      amount_cents: installmentAmountCents,
      payment_method: "credito",
      installments: installmentTotal,
      budget_group_id: budgetGroupId,
      occurred_at: todayIso,
      note: name,
    })
    .select("id")
    .single();

  if (transactionError || !transaction) {
    return { error: "Não foi possível salvar. Tente novamente." };
  }

  const { error } = await supabase.from("credit_card_purchases").insert({
    card_id: cardId,
    user_id: profile.id,
    name,
    amount_cents: installmentAmountCents,
    installment_current: installmentCurrent,
    installment_start: installmentCurrent,
    installment_total: installmentTotal,
    installment_anchor_at: todayIso,
    budget_group_id: budgetGroupId,
    transaction_id: transaction.id,
  });

  if (error) {
    await supabase.from("transactions").delete().eq("id", transaction.id);
    return { error: "Não foi possível salvar. Tente novamente." };
  }

  redirectWithToast(`/cartao/${cardId}`, "Compra adicionada!");
}

export async function updatePurchase(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();

  const purchaseId = String(formData.get("purchase_id"));
  const cardId = String(formData.get("card_id"));
  const name = String(formData.get("name") || "").trim();
  const totalCents = parseMoneyToCents(formData.get("amount"));
  const { current: installmentCurrent, total: installmentTotal } = clampInstallments(
    Number(formData.get("installment_current")),
    Number(formData.get("installment_total")),
  );
  const budgetGroupId = String(formData.get("budget_group_id") || "") || null;

  const { data: card } = await supabase
    .from("credit_cards")
    .select("id")
    .eq("id", cardId)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!name || totalCents <= 0 || !card) {
    return { error: "Preencha os dados da compra." };
  }

  const { data: purchase } = await supabase
    .from("credit_card_purchases")
    .select("id, amount_cents, transaction_id")
    .eq("id", purchaseId)
    .eq("card_id", cardId)
    .maybeSingle();

  if (!purchase) return { error: "Compra não encontrada." };

  const installmentAmountCents = Math.round(totalCents / installmentTotal);
  const todayIso = new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from("credit_card_purchases")
    .update({
      name,
      amount_cents: installmentAmountCents,
      installment_current: installmentCurrent,
      installment_start: installmentCurrent,
      installment_total: installmentTotal,
      installment_anchor_at: todayIso,
      budget_group_id: budgetGroupId,
    })
    .eq("id", purchaseId);

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  if (purchase.transaction_id) {
    // The linked transaction may already cover more than one installment
    // (rollCardInstallments books a multi-month catch-up in one go if the
    // family skips a few visits) — preserve that multiplier so editing a
    // purchase never quietly erases money that already left the account.
    const { data: transaction } = await supabase
      .from("transactions")
      .select("amount_cents")
      .eq("id", purchase.transaction_id)
      .maybeSingle();
    const multiplier =
      transaction && purchase.amount_cents > 0
        ? Math.max(1, Math.round(transaction.amount_cents / purchase.amount_cents))
        : 1;

    await supabase
      .from("transactions")
      .update({
        amount_cents: installmentAmountCents * multiplier,
        note: name,
        budget_group_id: budgetGroupId,
      })
      .eq("id", purchase.transaction_id);
  }

  redirectWithToast(`/cartao/${cardId}`, "Compra atualizada!");
}

export async function deletePurchase(formData: FormData) {
  const { supabase } = await getSessionContext();
  const purchaseId = String(formData.get("purchase_id"));
  const cardId = String(formData.get("card_id") || "");

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

  redirectWithToast(cardId ? `/cartao/${cardId}` : "/cartao", "Compra excluída.");
}
