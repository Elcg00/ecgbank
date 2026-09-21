"use server";

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";

function toCents(value: FormDataEntryValue | null) {
  return Number(String(value || "0").replace(/\D/g, "")) * 100;
}

export async function createGoal(formData: FormData) {
  const { supabase, profile } = await getSessionContext();

  const name = String(formData.get("name") || "").trim();
  const targetCents = toCents(formData.get("target"));
  const monthlyTargetCents = toCents(formData.get("monthly_target"));
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

export async function addContribution(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const goalId = String(formData.get("goal_id"));
  const addCents = toCents(formData.get("amount"));

  if (addCents <= 0) return;

  const { data: existing } = await supabase
    .from("goal_contributions")
    .select("amount_cents")
    .eq("goal_id", goalId)
    .eq("user_id", profile.id)
    .maybeSingle();

  await supabase.from("goal_contributions").upsert(
    {
      goal_id: goalId,
      user_id: profile.id,
      amount_cents: (existing?.amount_cents ?? 0) + addCents,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "goal_id,user_id" },
  );

  redirect(`/metas/${goalId}`);
}
