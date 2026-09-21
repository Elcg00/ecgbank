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

  if (!name || amountCents <= 0 || !dueDate) {
    return { error: "Preencha nome, valor e vencimento." };
  }

  const { error } = await supabase.from("bills").insert({
    family_id: profile.family_id,
    name,
    amount_cents: amountCents,
    due_date: dueDate,
    recurring,
  });

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast("/contas", "Conta adicionada!");
}

export async function markBillPaid(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const billId = String(formData.get("bill_id"));
  const paid = String(formData.get("paid")) === "true";

  await supabase
    .from("bills")
    .update({ paid, paid_at: paid ? new Date().toISOString().slice(0, 10) : null })
    .eq("id", billId)
    .eq("family_id", profile.family_id);

  revalidatePath("/contas");
  revalidatePath("/");
}

export async function updateBill(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();
  const billId = String(formData.get("bill_id"));
  const name = String(formData.get("name") || "").trim();
  const amountCents = parseMoneyToCents(formData.get("amount"));
  const dueDate = String(formData.get("due_date") || "");
  const recurring = formData.get("recurring") === "on";

  if (!name || amountCents <= 0 || !dueDate) {
    return { error: "Preencha nome, valor e vencimento." };
  }

  const { error } = await supabase
    .from("bills")
    .update({ name, amount_cents: amountCents, due_date: dueDate, recurring })
    .eq("id", billId)
    .eq("family_id", profile.family_id);

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast("/contas", "Conta atualizada!");
}

export async function deleteBill(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const billId = String(formData.get("bill_id"));

  await supabase.from("bills").delete().eq("id", billId).eq("family_id", profile.family_id);

  redirectWithToast("/contas", "Conta excluída.");
}
