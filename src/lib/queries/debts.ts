import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type DebtSummary = {
  id: string;
  name: string;
  remainingCents: number;
  originalCents: number;
  interestRateMonthly: number;
  installmentCount: number;
  installmentAmountCents: number;
  paidPct: number;
};

export async function getDebts(
  supabase: SupabaseClient,
  familyId: string,
  strategy: "menor_primeiro" | "maior_juros",
): Promise<DebtSummary[]> {
  const { data } = await supabase
    .from("debts")
    .select(
      "id, name, remaining_cents, original_amount_cents, interest_rate_monthly, installment_count, installment_amount_cents",
    )
    .eq("family_id", familyId);

  const debts: DebtSummary[] = (data ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    remainingCents: d.remaining_cents,
    originalCents: d.original_amount_cents,
    interestRateMonthly: Number(d.interest_rate_monthly),
    installmentCount: d.installment_count,
    installmentAmountCents: d.installment_amount_cents,
    paidPct:
      d.original_amount_cents > 0
        ? Math.round(((d.original_amount_cents - d.remaining_cents) / d.original_amount_cents) * 100)
        : 0,
  }));

  if (strategy === "maior_juros") {
    return debts.sort((a, b) => b.interestRateMonthly - a.interestRateMonthly);
  }
  return debts.sort((a, b) => a.remainingCents - b.remainingCents);
}
