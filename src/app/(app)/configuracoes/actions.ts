"use server";

import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";

export async function updateName(
  _prev: { error?: string; saved?: boolean } | undefined,
  formData: FormData,
) {
  const { supabase, profile } = await getSessionContext();
  const fullName = String(formData.get("full_name") || "").trim();

  if (!fullName) {
    return { error: "O nome não pode ficar vazio." };
  }

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id);
  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  revalidatePath("/", "layout");
  return { saved: true };
}

export async function updateIncome(
  _prev: { error?: string; saved?: boolean } | undefined,
  formData: FormData,
) {
  const { supabase, profile } = await getSessionContext();
  const incomeCents = parseMoneyToCents(formData.get("income"));

  const { error } = await supabase
    .from("onboarding_answers")
    .upsert({ user_id: profile.id, monthly_income_cents: incomeCents });

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  revalidatePath("/orcamento");
  return { saved: true };
}
