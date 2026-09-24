"use server";

import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";
import { normalizePreferences, setPreferenceCookies } from "@/lib/preferences";
import { AVATAR_COLORS } from "@/lib/avatar-colors";
import { redirectWithError } from "@/lib/toast";

export async function updateName(
  _prev: { error?: string; saved?: boolean } | undefined,
  formData: FormData,
) {
  const { supabase, profile } = await getSessionContext();
  const fullName = String(formData.get("full_name") || "").trim();

  if (!fullName) {
    return { error: "O nome não pode ficar vazio." };
  }

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id);
  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  revalidatePath("/", "layout");
  return { saved: true };
}

export async function updateIncome(
  _prev: { error?: string; saved?: boolean } | undefined,
  formData: FormData,
) {
  const { supabase, profile } = await getSessionContext();
  const incomeCents = parseMoneyToCents(formData.get("income"));

  const { error } = await supabase
    .from("onboarding_answers")
    .upsert({ user_id: profile.id, monthly_income_cents: incomeCents });

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  revalidatePath("/orcamento");
  return { saved: true };
}

export async function updatePreferences(
  _prev: { error?: string; saved?: boolean } | undefined,
  formData: FormData,
) {
  const { supabase, profile } = await getSessionContext();

  // accent_theme/heading_style no longer have a UI (the app has one fixed
  // brand identity now) — keep whatever is already stored instead of
  // resetting them to their defaults just because the form doesn't submit them.
  const prefs = normalizePreferences({
    theme_preference: String(formData.get("theme_preference") || ""),
    accent_theme: profile.accent_theme,
    heading_style: profile.heading_style,
  });

  const { error } = await supabase.from("profiles").update(prefs).eq("id", profile.id);
  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  await setPreferenceCookies(prefs);
  revalidatePath("/", "layout");
  return { saved: true };
}

export async function deactivateAccount() {
  const { supabase, profile } = await getSessionContext();

  await supabase
    .from("profiles")
    .update({ deactivated_at: new Date().toISOString() })
    .eq("id", profile.id);
  await supabase.auth.signOut();

  redirectWithError("/login", "Sua conta foi desativada. Peça a um administrador da família para reativar.");
}

export async function updateAvatarColor(
  _prev: { error?: string; saved?: boolean } | undefined,
  formData: FormData,
) {
  const { supabase, profile } = await getSessionContext();
  const color = String(formData.get("avatar_color") || "");

  if (!AVATAR_COLORS.includes(color as (typeof AVATAR_COLORS)[number])) {
    return { error: "Escolha uma das cores disponíveis." };
  }

  const { error } = await supabase.from("profiles").update({ avatar_color: color }).eq("id", profile.id);
  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  revalidatePath("/", "layout");
  return { saved: true };
}
