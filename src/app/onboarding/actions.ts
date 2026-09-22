"use server";

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";

const BASE_GROUPS = [
  { name: "Mercado", monogram: "M", kind: "spending" },
  { name: "Lazer", monogram: "L", kind: "spending" },
  { name: "Guardar", monogram: "G", kind: "saving" },
] as const;

// Maps each onboarding "fixed cost" chip to the group it should seed —
// several chips can share one group (utilities all land under "Casa").
const CHIP_GROUP_MAP: Record<string, { name: string; monogram: string }> = {
  "Aluguel/Financiamento": { name: "Casa", monogram: "C" },
  Energia: { name: "Casa", monogram: "C" },
  Água: { name: "Casa", monogram: "C" },
  Internet: { name: "Casa", monogram: "C" },
  "Escola/Faculdade": { name: "Educação", monogram: "E" },
  Assinaturas: { name: "Assinaturas", monogram: "A" },
};

const GOAL_REDIRECT: Record<string, string> = {
  divida: "/dividas",
  reserva: `/metas/nova?name=${encodeURIComponent("Reserva de emergência")}`,
  especial: `/metas/nova?name=${encodeURIComponent("Algo especial")}`,
};

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

/** Builds the starter group list from the fixed costs this person picked in
 * step 3, so a couple with no kids doesn't get a "Filhos" group and one
 * paying tuition does get an "Educação" one. */
async function seedDefaultGroups(
  supabase: Awaited<ReturnType<typeof getSessionContext>>["supabase"],
  familyId: string,
  fixedCostChips: string[],
) {
  const { count } = await supabase
    .from("budget_groups")
    .select("id", { count: "exact", head: true })
    .eq("family_id", familyId);

  if (count && count > 0) return;

  const groups = new Map<string, { name: string; monogram: string; kind: "spending" | "saving" }>();
  for (const g of BASE_GROUPS) groups.set(g.name, g);
  for (const chip of fixedCostChips) {
    const mapped = CHIP_GROUP_MAP[chip];
    if (mapped) groups.set(mapped.name, { ...mapped, kind: "spending" });
  }

  await supabase.from("budget_groups").insert(
    Array.from(groups.values()).map((g, i) => ({
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

  const { data: answers } = await supabase
    .from("onboarding_answers")
    .select("fixed_cost_chips, first_goal, org_model")
    .eq("user_id", profile.id)
    .maybeSingle();

  await supabase
    .from("onboarding_answers")
    .upsert({ user_id: profile.id, completed_at: new Date().toISOString() });
  await supabase
    .from("profiles")
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("id", profile.id);

  await seedDefaultGroups(supabase, profile.family_id, answers?.fixed_cost_chips ?? []);

  if (answers?.org_model === "dividas") {
    await supabase.from("families").update({ debt_strategy: "maior_juros" }).eq("id", profile.family_id);
  }

  redirect(GOAL_REDIRECT[answers?.first_goal ?? ""] ?? "/");
}
