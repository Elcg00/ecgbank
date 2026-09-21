"use server";

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";

export async function createTransaction(formData: FormData) {
  const { supabase, profile } = await getSessionContext();

  const type = String(formData.get("type") || "saida");
  const amountCents = Number(formData.get("amount_cents") || 0);
  const budgetGroupId = String(formData.get("budget_group_id") || "") || null;
  const paymentMethod = String(formData.get("payment_method") || "") || null;
  const installments = Number(formData.get("installments") || 1);
  const memberId = String(formData.get("member_id") || profile.id);
  const recurring = formData.get("recurring") === "on";

  if (amountCents <= 0) {
    throw new Error("Informe um valor maior que zero.");
  }

  await supabase.from("transactions").insert({
    family_id: profile.family_id,
    user_id: memberId,
    type,
    amount_cents: amountCents,
    budget_group_id: type === "saida" ? budgetGroupId : null,
    payment_method: paymentMethod,
    installments: paymentMethod === "credito" ? installments : 1,
    recurring,
  });

  redirect("/");
}
