import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureFamily } from "@/lib/family";

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
    .select("id, family_id, full_name, role, onboarding_completed_at, theme_preference, accent_theme, heading_style")
    .eq("id", user.id)
    .single();

  if (error || !profile) redirect("/login");

  const familyId = await ensureFamily(supabase, profile, user.email);

  return {
    supabase,
    userId: user.id,
    email: user.email,
    profile: { ...profile, family_id: familyId },
  };
}
