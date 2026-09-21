"use server";

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";

export async function setDebtStrategy(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const strategy = String(formData.get("strategy") || "menor_primeiro");

  await supabase.from("families").update({ debt_strategy: strategy }).eq("id", profile.family_id);
  redirect("/dividas");
}

export async function createDebt(formData: FormData) {
  const { supabase, profile } = await getSessionContext();

  const name = String(formData.get("name") || "").trim();
  const remainingCents = parseMoneyToCents(formData.get("remaining"));
  const interestRate = Number(String(formData.get("interest_rate") || "0").replace(",", "."));
  const installmentCount = Number(formData.get("installment_count") || 1);
  const installmentAmountCents = parseMoneyToCents(formData.get("installment_amount"));

  if (!name || remainingCents <= 0) {
    throw new Error("Preencha o nome e o valor restante da dívida.");
  }

  await supabase.from("debts").insert({
    family_id: profile.family_id,
    name,
    original_amount_cents: remainingCents,
    remaining_cents: remainingCents,
    interest_rate_monthly: interestRate,
    installment_count: installmentCount,
    installment_amount_cents: installmentAmountCents,
  });

  redirect("/dividas");
}

export async function updateDebt(formData: FormData) {
  const { supabase, profile } = await getSessionContext();

  const debtId = String(formData.get("debt_id"));
  const name = String(formData.get("name") || "").trim();
  const remainingCents = parseMoneyToCents(formData.get("remaining"));
  const interestRate = Number(String(formData.get("interest_rate") || "0").replace(",", "."));
  const installmentCount = Number(formData.get("installment_count") || 1);
  const installmentAmountCents = parseMoneyToCents(formData.get("installment_amount"));

  if (!name || remainingCents < 0) {
    throw new Error("Preencha o nome e o valor restante da dívida.");
  }

  await supabase
    .from("debts")
    .update({
      name,
      remaining_cents: remainingCents,
      interest_rate_monthly: interestRate,
      installment_count: installmentCount,
      installment_amount_cents: installmentAmountCents,
    })
    .eq("id", debtId)
    .eq("family_id", profile.family_id);

  redirect("/dividas");
}

export async function deleteDebt(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const debtId = String(formData.get("debt_id"));

  await supabase.from("debts").delete().eq("id", debtId).eq("family_id", profile.family_id);

  redirect("/dividas");
}

export async function registerDebtPayment(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const debtId = String(formData.get("debt_id"));
  const paymentCents = parseMoneyToCents(formData.get("amount"));

  const { data: debt } = await supabase
    .from("debts")
    .select("remaining_cents")
    .eq("id", debtId)
    .eq("family_id", profile.family_id)
    .single();

  if (debt) {
    await supabase
      .from("debts")
      .update({ remaining_cents: Math.max(0, debt.remaining_cents - paymentCents) })
      .eq("id", debtId);
  }

  redirect("/dividas");
}
