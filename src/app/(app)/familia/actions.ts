"use server";

import { getSessionContext } from "@/lib/session";
import { redirectWithToast, redirectWithError } from "@/lib/toast";

export async function inviteMember(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    redirectWithError("/familia", "Informe um e-mail para convidar.");
  }

  const { error } = await supabase.from("family_invites").insert({
    family_id: profile.family_id,
    email,
    invited_by: profile.id,
  });

  if (error) redirectWithError("/familia", "Não foi possível enviar o convite.");

  redirectWithToast("/familia", "Convite enviado!");
}

export async function revokeInvite(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const inviteId = String(formData.get("invite_id"));

  await supabase
    .from("family_invites")
    .update({ status: "revoked" })
    .eq("id", inviteId)
    .eq("family_id", profile.family_id);

  redirectWithToast("/familia", "Convite cancelado.");
}

export async function removeMember(formData: FormData) {
  const { supabase } = await getSessionContext();
  const memberId = String(formData.get("member_id"));

  const { error } = await supabase.rpc("remove_family_member", { p_member_id: memberId });
  if (error) redirectWithError("/familia", "Não foi possível remover esse membro.");

  redirectWithToast("/familia", "Membro removido.");
}

export async function toggleMemberRole(formData: FormData) {
  const { supabase } = await getSessionContext();
  const memberId = String(formData.get("member_id"));
  const newRole = String(formData.get("new_role"));

  const { error } = await supabase.rpc("set_family_member_role", {
    p_member_id: memberId,
    p_role: newRole,
  });
  if (error) redirectWithError("/familia", "Não foi possível alterar o papel desse membro.");

  redirectWithToast("/familia", "Papel atualizado!");
}

export async function toggleMemberActive(formData: FormData) {
  const { supabase } = await getSessionContext();
  const memberId = String(formData.get("member_id"));
  const deactivate = formData.get("deactivate") === "true";

  const { error } = await supabase.rpc("deactivate_family_member", {
    p_member_id: memberId,
    p_deactivated: deactivate,
  });
  if (error) redirectWithError("/familia", "Não foi possível atualizar o acesso desse membro.");

  redirectWithToast("/familia", deactivate ? "Acesso desativado." : "Acesso reativado!");
}
