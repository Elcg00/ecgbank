"use server";

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";

export async function updateGroupLimit(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const groupId = String(formData.get("group_id"));
  const reais = Number(String(formData.get("limit") || "0").replace(/\D/g, ""));

  await supabase
    .from("budget_groups")
    .update({ limit_cents: reais * 100 })
    .eq("id", groupId)
    .eq("family_id", profile.family_id);

  redirect("/orcamento");
}
