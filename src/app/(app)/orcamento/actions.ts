"use server";

import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";
import { redirectWithToast } from "@/lib/toast";

type FormState = { error?: string } | undefined;

function monogramOf(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export async function createGroup(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();
  const name = String(formData.get("name") || "").trim();
  const kind = String(formData.get("kind") || "spending");
  const limitCents = parseMoneyToCents(formData.get("limit"));

  if (!name) {
    return { error: "Dê um nome para o grupo." };
  }

  const { count } = await supabase
    .from("budget_groups")
    .select("id", { count: "exact", head: true })
    .eq("family_id", profile.family_id);

  const { error } = await supabase.from("budget_groups").insert({
    family_id: profile.family_id,
    name,
    monogram: monogramOf(name),
    kind: kind === "saving" ? "saving" : "spending",
    limit_cents: limitCents,
    sort_order: count ?? 0,
  });

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast("/orcamento", "Grupo criado!");
}

export async function updateGroup(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await getSessionContext();
  const groupId = String(formData.get("group_id"));
  const name = String(formData.get("name") || "").trim();
  const limitCents = parseMoneyToCents(formData.get("limit"));

  if (!name) {
    return { error: "Dê um nome para o grupo." };
  }

  const { error } = await supabase
    .from("budget_groups")
    .update({ name, monogram: monogramOf(name), limit_cents: limitCents })
    .eq("id", groupId)
    .eq("family_id", profile.family_id);

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  redirectWithToast(`/orcamento/${groupId}`, "Grupo atualizado!");
}

export async function deleteGroup(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const groupId = String(formData.get("group_id"));

  await supabase.from("budget_groups").delete().eq("id", groupId).eq("family_id", profile.family_id);

  redirectWithToast("/orcamento", "Grupo excluído.");
}
