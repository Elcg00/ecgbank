import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Installments advance lazily on page view, same pattern as
 * rollRecurringBills: no cron job, just catch the row up whenever anyone
 * looks at it. installment_start (fixed at creation) plus months elapsed
 * since created_at tells us where installment_current should be now.
 */
export async function rollCardInstallments(supabase: SupabaseClient, cardIds: string[]): Promise<void> {
  if (cardIds.length === 0) return;

  const { data: purchases } = await supabase
    .from("credit_card_purchases")
    .select("id, created_at, installment_start, installment_total, installment_current")
    .in("card_id", cardIds);

  if (!purchases || purchases.length === 0) return;

  const today = new Date();

  await Promise.all(
    purchases.map((p) => {
      const created = new Date(p.created_at);
      const monthsElapsed =
        (today.getFullYear() - created.getFullYear()) * 12 + (today.getMonth() - created.getMonth());
      const expected = Math.min(p.installment_total, p.installment_start + Math.max(0, monthsElapsed));

      if (expected === p.installment_current) return null;

      return supabase.from("credit_card_purchases").update({ installment_current: expected }).eq("id", p.id);
    }),
  );
}
