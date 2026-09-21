"use server";

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";

const DEFAULT_GROUPS = [
  { name: "Casa", monogram: "C", kind: "spending" },
  { name: "Mercado", monogram: "M", kind: "spending" },
  { name: "Filhos", monogram: "F", kind: "spending" },
  { name: "Lazer", monogram: "L", kind: "spending" },
  { name: "Guardar", monogram: "G", kind: "saving" },
] as const;

export async function saveIncome(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const reais = Number(String(formData.get("income") || "0").replace(/\D/g, ""));

  await supabase.from("onboarding_answers").upsert({
    user_id: profile.id,
    monthly_income_cents: reais * 100,
  });

  redirect("/onboarding/3");
}

export async function saveFixedCosts(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const chips = formData.getAll("fixed_cost").map(String);

  await supabase
    .from("onboarding_answers")
    .upsert({ user_id: profile.id, fixed_cost_chips: chips });

  redirect("/onboarding/4");
}

export async function saveHasDebts(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const hasDebts = String(formData.get("has_debts")) === "sim";

  await supabase
    .from("onboarding_answers")
    .upsert({ user_id: profile.id, has_debts: hasDebts });

  redirect("/onboarding/5");
}

export async function saveFirstGoal(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const firstGoal = String(formData.get("first_goal") || "");

  await supabase
    .from("onboarding_answers")
    .upsert({ user_id: profile.id, first_goal: firstGoal });

  redirect("/onboarding/6");
}

export async function saveOrgModel(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const orgModel = String(formData.get("org_model") || "");

  await supabase
    .from("onboarding_answers")
    .upsert({ user_id: profile.id, org_model: orgModel });

  redirect("/onboarding/7");
}

async function seedDefaultGroups(
  supabase: Awaited<ReturnType<typeof getSessionContext>>["supabase"],
  familyId: string,
) {
  const { count } = await supabase
    .from("budget_groups")
    .select("id", { count: "exact", head: true })
    .eq("family_id", familyId);

  if (count && count > 0) return;

  await supabase.from("budget_groups").insert(
    DEFAULT_GROUPS.map((g, i) => ({
      family_id: familyId,
      name: g.name,
      monogram: g.monogram,
      kind: g.kind,
      limit_cents: 0,
      sort_order: i,
    })),
  );
}

export async function finishOnboarding(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const email = String(formData.get("partner_email") || "").trim();

  if (email) {
    await supabase.from("family_invites").insert({
      family_id: profile.family_id,
      email,
      invited_by: profile.id,
    });
  }

  await supabase
    .from("onboarding_answers")
    .upsert({ user_id: profile.id, completed_at: new Date().toISOString() });
  await supabase
    .from("profiles")
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("id", profile.id);

  await seedDefaultGroups(supabase, profile.family_id);

  redirect("/");
}
