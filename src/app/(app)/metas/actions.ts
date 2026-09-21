"use server";

import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";
import { redirectWithToast } from "@/lib/toast";

type FormState = { error?: string } | undefined;

export async function createGoal(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();

  const name = String(formData.get("name") || "").trim();
  const targetCents = parseMoneyToCents(formData.get("target"));
  const monthlyTargetCents = parseMoneyToCents(formData.get("monthly_target"));
  const deadline = String(formData.get("deadline") || "") || null;
  const shared = formData.get("shared") === "on";

  if (!name || targetCents <= 0) {
    return { error: "Preencha o nome e um valor alvo válido." };
  }

  const { error } = await supabase.from("goals").insert({
    family_id: profile.family_id,
    name,
    target_cents: targetCents,
    monthly_target_cents: monthlyTargetCents,
    deadline,
    shared,
  });

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast("/metas", "Meta criada!");
}

export async function updateGoal(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();

  const goalId = String(formData.get("goal_id"));
  const name = String(formData.get("name") || "").trim();
  const targetCents = parseMoneyToCents(formData.get("target"));
  const monthlyTargetCents = parseMoneyToCents(formData.get("monthly_target"));
  const deadline = String(formData.get("deadline") || "") || null;
  const shared = formData.get("shared") === "on";

  if (!name || targetCents <= 0) {
    return { error: "Preencha o nome e um valor alvo válido." };
  }

  const { error } = await supabase
    .from("goals")
    .update({ name, target_cents: targetCents, monthly_target_cents: monthlyTargetCents, deadline, shared })
    .eq("id", goalId)
    .eq("family_id", profile.family_id);

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast(`/metas/${goalId}`, "Meta atualizada!");
}

export async function deleteGoal(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const goalId = String(formData.get("goal_id"));

  await supabase.from("goals").delete().eq("id", goalId).eq("family_id", profile.family_id);

  redirectWithToast("/metas", "Meta excluída.");
}

export async function setContribution(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();
  const goalId = String(formData.get("goal_id"));
  const amountCents = parseMoneyToCents(formData.get("amount"));

  await supabase.from("goal_contributions").upsert(
    {
      goal_id: goalId,
      user_id: profile.id,
      amount_cents: Math.max(0, amountCents),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "goal_id,user_id" },
  );

  redirectWithToast(`/metas/${goalId}`, "Valor guardado atualizado!");
}
