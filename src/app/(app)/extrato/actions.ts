"use server";

import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";
import { redirectWithToast } from "@/lib/toast";

type FormState = { error?: string } | undefined;

export async function updateTransaction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();
  const id = String(formData.get("id"));
  const type = String(formData.get("type") || "saida");
  const amountCents = parseMoneyToCents(formData.get("amount"));
  const budgetGroupId = String(formData.get("budget_group_id") || "") || null;
  const occurredAt = String(formData.get("occurred_at") || "");

  if (amountCents <= 0) {
    return { error: "Informe um valor maior que zero." };
  }

  const { error } = await supabase
    .from("transactions")
    .update({
      type,
      amount_cents: amountCents,
      budget_group_id: type === "saida" ? budgetGroupId : null,
      occurred_at: occurredAt || undefined,
    })
    .eq("id", id)
    .eq("family_id", profile.family_id);

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast("/extrato", "Lançamento atualizado!");
}

export async function deleteTransaction(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const id = String(formData.get("id"));

  await supabase.from("transactions").delete().eq("id", id).eq("family_id", profile.family_id);

  redirectWithToast("/extrato", "Lançamento excluído.");
}
