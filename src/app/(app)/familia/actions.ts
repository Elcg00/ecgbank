"use server";

import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/session";

export async function inviteMember(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const email = String(formData.get("email") || "").trim();

  if (!email) return;

  await supabase.from("family_invites").insert({
    family_id: profile.family_id,
    email,
    invited_by: profile.id,
  });

  revalidatePath("/familia");
}

export async function revokeInvite(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const inviteId = String(formData.get("invite_id"));

  await supabase
    .from("family_invites")
    .update({ status: "revoked" })
    .eq("id", inviteId)
    .eq("family_id", profile.family_id);

  revalidatePath("/familia");
}
