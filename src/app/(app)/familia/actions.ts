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

export async function removeMember(formData: FormData) {
  const { supabase } = await getSessionContext();
  const memberId = String(formData.get("member_id"));

  const { error } = await supabase.rpc("remove_family_member", { p_member_id: memberId });
  if (error) throw new Error(error.message);

  revalidatePath("/familia");
}

export async function toggleMemberRole(formData: FormData) {
  const { supabase } = await getSessionContext();
  const memberId = String(formData.get("member_id"));
  const newRole = String(formData.get("new_role"));

  const { error } = await supabase.rpc("set_family_member_role", {
    p_member_id: memberId,
    p_role: newRole,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/familia");
}
