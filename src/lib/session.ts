import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureFamily } from "@/lib/family";
import { redirectWithError } from "@/lib/toast";

export type SessionContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  email: string | undefined;
  profile: {
    id: string;
    family_id: string;
    full_name: string;
    role: string;
    onboarding_completed_at: string | null;
    theme_preference: string;
    accent_theme: string;
    heading_style: string;
    avatar_color: string;
  };
};

/** Loads the signed-in user's profile, provisioning a family on first login. */
export async function getSessionContext(): Promise<SessionContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, family_id, full_name, role, onboarding_completed_at, theme_preference, accent_theme, heading_style, avatar_color, deactivated_at",
    )
    .eq("id", user.id)
    .single();

  if (error || !profile) redirect("/login");

  if (profile.deactivated_at) {
    await supabase.auth.signOut();
    redirectWithError("/login", "Sua conta foi desativada. Peça a um administrador da família para reativar.");
  }

  const familyId = await ensureFamily(supabase, profile, user.email);

  return {
    supabase,
    userId: user.id,
    email: user.email,
    profile: { ...profile, family_id: familyId },
  };
}
