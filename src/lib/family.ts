import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

type Profile = {
  id: string;
  family_id: string | null;
  full_name: string;
  role: string;
  onboarding_completed_at: string | null;
};

/**
 * First login after sign-up: a profile has no family yet. Join a pending
 * invite addressed to this e-mail if one exists, otherwise start a new
 * family with this user as its admin.
 */
export async function ensureFamily(
  supabase: SupabaseClient,
  profile: Profile,
  email: string | undefined,
): Promise<string> {
  if (profile.family_id) return profile.family_id;

  if (email) {
    // Runs as a SECURITY DEFINER function (not a plain table update) so it
    // can only ever assign a family_id backed by a real pending invite
    // addressed to the caller's own authenticated e-mail — see the function
    // definition for why a direct client update can't be allowed here.
    const { data: joinedFamilyId } = await supabase.rpc("accept_pending_invite");
    if (joinedFamilyId) return joinedFamilyId as string;
  }

  // Runs as a single SECURITY DEFINER transaction (creates the family and
  // links this profile to it) so it isn't tripped up by RLS: right after the
  // INSERT, current_family_id() still resolves to null for this user until
  // the profile is linked, which made a plain insert().select() come back
  // empty (Postgres also applies the SELECT policy to RETURNING rows).
  const { data: familyId, error } = await supabase.rpc("provision_family", {
    p_name: `Família de ${profile.full_name || "vocês"}`,
  });

  if (error || !familyId) {
    throw new Error("Não foi possível preparar sua família.");
  }

  return familyId as string;
}
