import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

function addMonths(dateStr: string, months: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

/**
 * A recurring bill that was paid and whose due date has passed is rolled
 * forward to its next monthly occurrence (unpaid) so the user doesn't have
 * to recreate rent/internet/etc. every month. Runs lazily on page view
 * instead of a cron job — cheap, and it only ever affects a handful of rows.
 */
export async function rollRecurringBills(supabase: SupabaseClient, familyId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);

  const { data: due } = await supabase
    .from("bills")
    .select("id, due_date")
    .eq("family_id", familyId)
    .eq("recurring", true)
    .eq("paid", true)
    .lt("due_date", today);

  if (!due || due.length === 0) return;

  await Promise.all(
    due.map((bill) => {
      let nextDue = bill.due_date;
      for (let i = 0; i < 24 && nextDue < today; i++) {
        nextDue = addMonths(nextDue, 1);
      }
      return supabase
        .from("bills")
        .update({ due_date: nextDue, paid: false, paid_at: null, transaction_id: null })
        .eq("id", bill.id);
    }),
  );
}
