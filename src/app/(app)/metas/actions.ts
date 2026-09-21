"use server";

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";

export async function createGoal(formData: FormData) {
  const { supabase, profile } = await getSessionContext();

  const name = String(formData.get("name") || "").trim();
  const targetCents = parseMoneyToCents(formData.get("target"));
  const monthlyTargetCents = parseMoneyToCents(formData.get("monthly_target"));
  const deadline = String(formData.get("deadline") || "") || null;
  const shared = formData.get("shared") === "on";

  if (!name || targetCents <= 0) {
    throw new Error("Preencha o nome e um valor alvo válido.");
  }

  await supabase.from("goals").insert({
    family_id: profile.family_id,
    name,
    target_cents: targetCents,
    monthly_target_cents: monthlyTargetCents,
    deadline,
    shared,
  });

  redirect("/metas");
}

export async function updateGoal(formData: FormData) {
  const { supabase, profile } = await getSessionContext();

  const goalId = String(formData.get("goal_id"));
  const name = String(formData.get("name") || "").trim();
  const targetCents = parseMoneyToCents(formData.get("target"));
  const monthlyTargetCents = parseMoneyToCents(formData.get("monthly_target"));
  const deadline = String(formData.get("deadline") || "") || null;
  const shared = formData.get("shared") === "on";

  if (!name || targetCents <= 0) {
    throw new Error("Preencha o nome e um valor alvo válido.");
  }

  await supabase
    .from("goals")
    .update({ name, target_cents: targetCents, monthly_target_cents: monthlyTargetCents, deadline, shared })
    .eq("id", goalId)
    .eq("family_id", profile.family_id);

  redirect(`/metas/${goalId}`);
}

export async function deleteGoal(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const goalId = String(formData.get("goal_id"));

  await supabase.from("goals").delete().eq("id", goalId).eq("family_id", profile.family_id);

  redirect("/metas");
}

export async function setContribution(formData: FormData) {
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

  redirect(`/metas/${goalId}`);
}
