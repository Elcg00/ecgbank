"use server";

import { getSessionContext } from "@/lib/session";
import { redirectWithToast } from "@/lib/toast";

const INCOME_SOURCES = ["salario", "extra", "reembolso", "outro"];

export async function createTransaction(formData: FormData) {
  const { supabase, profile } = await getSessionContext();

  const type = String(formData.get("type") || "saida");
  const amountCents = Number(formData.get("amount_cents") || 0);
  const budgetGroupId = String(formData.get("budget_group_id") || "") || null;
  const incomeSourceRaw = String(formData.get("income_source") || "") || null;
  const incomeSource = incomeSourceRaw && INCOME_SOURCES.includes(incomeSourceRaw) ? incomeSourceRaw : null;
  const paymentMethod = String(formData.get("payment_method") || "") || null;
  const installments = Number(formData.get("installments") || 1);
  const memberId = String(formData.get("member_id") || profile.id);
  const recurring = formData.get("recurring") === "on";
  const note = String(formData.get("note") || "").trim() || null;

  if (amountCents <= 0) {
    throw new Error("Informe um valor maior que zero.");
  }

  await supabase.from("transactions").insert({
    family_id: profile.family_id,
    user_id: memberId,
    type,
    amount_cents: amountCents,
    budget_group_id: type === "saida" ? budgetGroupId : null,
    income_source: type === "entrada" ? incomeSource : null,
    payment_method: paymentMethod,
    installments: paymentMethod === "credito" ? installments : 1,
    recurring,
    note,
  });

  redirectWithToast("/", "Lançamento salvo!");
}
