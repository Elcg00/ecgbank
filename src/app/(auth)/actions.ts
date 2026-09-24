"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { normalizePreferences, setPreferenceCookies } from "@/lib/preferences";

async function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get("host");
  return host ? `https://${host}` : "http://localhost:3000";
}

export async function signIn(_prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("theme_preference, accent_theme, heading_style, deactivated_at")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.deactivated_at) {
    await supabase.auth.signOut();
    return { error: "Esta conta foi desativada. Peça a um administrador da família para reativar." };
  }

  if (profile) await setPreferenceCookies(normalizePreferences(profile));

  redirect("/");
}

export async function signUp(_prev: { error?: string } | undefined, formData: FormData) {
  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${await siteUrl()}/auth/confirm`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Esse e-mail já tem cadastro. Tente entrar." };
    }
    return { error: "Não foi possível criar sua conta. Tente novamente." };
  }

  // With e-mail confirmation turned off in Supabase, signUp already returns
  // a live session — sending this person to "verifique seu e-mail" would stall
  // them waiting on a confirmation link that's never coming. Only show that
  // page when confirmation is actually pending (no session yet).
  if (data.session) {
    redirect("/");
  }

  redirect("/cadastro/verifique-email");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(
  _prev: { error?: string; sent?: boolean } | undefined,
  formData: FormData,
) {
  const email = String(formData.get("email") || "").trim();
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await siteUrl()}/auth/confirm?next=/redefinir-senha`,
  });
  // Always report success, so we don't leak which e-mails have accounts.
  return { sent: true };
}

export async function updatePassword(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const password = String(formData.get("password") || "");
  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Não foi possível atualizar a senha." };
  redirect("/");
}
