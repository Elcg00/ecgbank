import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Installments advance lazily on page view, same pattern as
 * rollRecurringBills: no cron job, just catch the row up whenever anyone
 * looks at it. installment_start (fixed at creation) plus months elapsed
 * since created_at tells us where installment_current should be now.
 *
 * Each newly-due installment also books a fresh saída transaction — a
 * R$2.500 purchase in 10x should only ever hit a given month's balance for
 * R$250, not the full R$2.500 up front (that already happened once, at
 * creation, for the first installment).
 */
export async function rollCardInstallments(supabase: SupabaseClient, cardIds: string[]): Promise<void> {
  if (cardIds.length === 0) return;

  const { data: purchases } = await supabase
    .from("credit_card_purchases")
    .select(
      "id, name, amount_cents, created_at, installment_start, installment_total, installment_current, user_id, credit_cards(family_id)",
    )
    .in("card_id", cardIds);

  if (!purchases || purchases.length === 0) return;

  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  await Promise.all(
    purchases.map(async (p) => {
      const created = new Date(p.created_at);
      const monthsElapsed =
        (today.getFullYear() - created.getFullYear()) * 12 + (today.getMonth() - created.getMonth());
      const expected = Math.min(p.installment_total, p.installment_start + Math.max(0, monthsElapsed));

      if (expected <= p.installment_current) return;

      const familyId = (p.credit_cards as unknown as { family_id: string } | null)?.family_id;
      if (!familyId || !p.user_id) {
        // Can't attribute a transaction safely (e.g. purchase predates the
        // user_id column) — still advance the counter so the card's "used
        // limit" progress stays accurate.
        await supabase.from("credit_card_purchases").update({ installment_current: expected }).eq("id", p.id);
        return;
      }

      const elapsedInstallments = expected - p.installment_current;
      const { data: transaction } = await supabase
        .from("transactions")
        .insert({
          family_id: familyId,
          user_id: p.user_id,
          type: "saida",
          amount_cents: p.amount_cents * elapsedInstallments,
          payment_method: "credito",
          occurred_at: todayIso,
          note: p.name,
        })
        .select("id")
        .single();

      await supabase
        .from("credit_card_purchases")
        .update({ installment_current: expected, transaction_id: transaction?.id ?? null })
        .eq("id", p.id);
    }),
  );
}
