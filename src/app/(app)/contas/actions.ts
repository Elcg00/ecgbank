"use server";

import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";
import { redirectWithToast } from "@/lib/toast";

type FormState = { error?: string } | undefined;

export async function createBill(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();

  const name = String(formData.get("name") || "").trim();
  const amountCents = parseMoneyToCents(formData.get("amount"));
  const dueDate = String(formData.get("due_date") || "");
  const recurring = formData.get("recurring") === "on";
  const budgetGroupId = String(formData.get("budget_group_id") || "") || null;

  if (!name || amountCents <= 0 || !dueDate) {
    return { error: "Preencha nome, valor e vencimento." };
  }

  const { error } = await supabase.from("bills").insert({
    family_id: profile.family_id,
    name,
    amount_cents: amountCents,
    due_date: dueDate,
    recurring,
    budget_group_id: budgetGroupId,
  });

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast("/contas", "Conta adicionada!");
}

export async function markBillPaid(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const billId = String(formData.get("bill_id"));
  const paid = String(formData.get("paid")) === "true";

  const { data: bill } = await supabase
    .from("bills")
    .select("amount_cents, budget_group_id, transaction_id")
    .eq("id", billId)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!bill) return;

  if (paid) {
    const { data: transaction } = await supabase
      .from("transactions")
      .insert({
        family_id: profile.family_id,
        user_id: profile.id,
        type: "saida",
        amount_cents: bill.amount_cents,
        budget_group_id: bill.budget_group_id,
        occurred_at: new Date().toISOString().slice(0, 10),
      })
      .select("id")
      .single();

    await supabase
      .from("bills")
      .update({
        paid: true,
        paid_at: new Date().toISOString().slice(0, 10),
        transaction_id: transaction?.id ?? null,
      })
      .eq("id", billId);
  } else {
    if (bill.transaction_id) {
      await supabase.from("transactions").delete().eq("id", bill.transaction_id);
    }
    await supabase.from("bills").update({ paid: false, paid_at: null, transaction_id: null }).eq("id", billId);
  }

  revalidatePath("/contas");
  revalidatePath("/");
  revalidatePath("/extrato");
  revalidatePath("/orcamento");
}

export async function updateBill(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();
  const billId = String(formData.get("bill_id"));
  const name = String(formData.get("name") || "").trim();
  const amountCents = parseMoneyToCents(formData.get("amount"));
  const dueDate = String(formData.get("due_date") || "");
  const recurring = formData.get("recurring") === "on";
  const budgetGroupId = String(formData.get("budget_group_id") || "") || null;

  if (!name || amountCents <= 0 || !dueDate) {
    return { error: "Preencha nome, valor e vencimento." };
  }

  const { error } = await supabase
    .from("bills")
    .update({ name, amount_cents: amountCents, due_date: dueDate, recurring, budget_group_id: budgetGroupId })
    .eq("id", billId)
    .eq("family_id", profile.family_id);

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast("/contas", "Conta atualizada!");
}

export async function deleteBill(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const billId = String(formData.get("bill_id"));

  const { data: bill } = await supabase
    .from("bills")
    .select("transaction_id")
    .eq("id", billId)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (bill?.transaction_id) {
    await supabase.from("transactions").delete().eq("id", bill.transaction_id);
  }

  await supabase.from("bills").delete().eq("id", billId).eq("family_id", profile.family_id);

  redirectWithToast("/contas", "Conta excluída.");
}
