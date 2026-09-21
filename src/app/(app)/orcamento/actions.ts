"use server";

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";

function monogramOf(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export async function createGroup(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const name = String(formData.get("name") || "").trim();
  const kind = String(formData.get("kind") || "spending");
  const limitCents = parseMoneyToCents(formData.get("limit"));

  if (!name) {
    throw new Error("Dê um nome para o grupo.");
  }

  const { count } = await supabase
    .from("budget_groups")
    .select("id", { count: "exact", head: true })
    .eq("family_id", profile.family_id);

  await supabase.from("budget_groups").insert({
    family_id: profile.family_id,
    name,
    monogram: monogramOf(name),
    kind: kind === "saving" ? "saving" : "spending",
    limit_cents: limitCents,
    sort_order: count ?? 0,
  });

  redirect("/orcamento");
}

export async function updateGroup(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const groupId = String(formData.get("group_id"));
  const name = String(formData.get("name") || "").trim();
  const limitCents = parseMoneyToCents(formData.get("limit"));

  if (!name) {
    throw new Error("Dê um nome para o grupo.");
  }

  await supabase
    .from("budget_groups")
    .update({ name, monogram: monogramOf(name), limit_cents: limitCents })
    .eq("id", groupId)
    .eq("family_id", profile.family_id);

  redirect("/orcamento");
}

export async function deleteGroup(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const groupId = String(formData.get("group_id"));

  await supabase.from("budget_groups").delete().eq("id", groupId).eq("family_id", profile.family_id);

  redirect("/orcamento");
}
