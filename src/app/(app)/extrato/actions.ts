"use server";

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";

export async function updateTransaction(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const id = String(formData.get("id"));
  const type = String(formData.get("type") || "saida");
  const amountCents = parseMoneyToCents(formData.get("amount"));
  const budgetGroupId = String(formData.get("budget_group_id") || "") || null;
  const occurredAt = String(formData.get("occurred_at") || "");

  if (amountCents <= 0) {
    throw new Error("Informe um valor maior que zero.");
  }

  await supabase
    .from("transactions")
    .update({
      type,
      amount_cents: amountCents,
      budget_group_id: type === "saida" ? budgetGroupId : null,
      occurred_at: occurredAt || undefined,
    })
    .eq("id", id)
    .eq("family_id", profile.family_id);

  redirect("/extrato");
}

export async function deleteTransaction(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const id = String(formData.get("id"));

  await supabase.from("transactions").delete().eq("id", id).eq("family_id", profile.family_id);

  redirect("/extrato");
}
