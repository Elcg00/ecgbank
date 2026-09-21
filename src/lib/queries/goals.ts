import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GoalSummary } from "@/components/app/GoalCard";

export async function getGoals(supabase: SupabaseClient, familyId: string): Promise<GoalSummary[]> {
  const { data: goals } = await supabase
    .from("goals")
    .select("id, name, target_cents, deadline, shared, monthly_target_cents")
    .eq("family_id", familyId)
    .order("created_at");

  if (!goals || goals.length === 0) return [];

  const { data: contributions } = await supabase
    .from("goal_contributions")
    .select("goal_id, user_id, amount_cents, profiles(full_name)")
    .in(
      "goal_id",
      goals.map((g) => g.id),
    );

  return goals.map((g) => {
    const rows = (contributions ?? []).filter((c) => c.goal_id === g.id);
    const savedCents = rows.reduce((s, c) => s + c.amount_cents, 0);
    return {
      ...g,
      savedCents,
      contributions: rows.map((c) => ({
        userId: c.user_id,
        name: (c.profiles as unknown as { full_name: string } | null)?.full_name || "Membro",
        amountCents: c.amount_cents,
      })),
    };
  });
}
