import Link from "next/link";
import { Plus } from "lucide-react";
import { getSessionContext } from "@/lib/session";
import { getDebts } from "@/lib/queries/debts";
import { PageHeader } from "@/components/app/PageHeader";
import { PlanTabs } from "@/components/app/PlanTabs";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { MoneyField } from "@/components/ui/MoneyField";
import { formatCents } from "@/lib/format";
import { setDebtStrategy, registerDebtPayment } from "./actions";

const STRATEGIES = [
  { value: "menor_primeiro", label: "Menor dívida primeiro", explainer: "Bola de neve: quite primeiro as dívidas menores para ganhar tração e motivação." },
  { value: "maior_juros", label: "Maior juros primeiro", explainer: "Avalanche: quite primeiro as dívidas com juros mais altos para pagar menos no total." },
] as const;

export default async function DividasPage() {
  const { supabase, profile } = await getSessionContext();
  const { data: family } = await supabase
    .from("families")
    .select("debt_strategy")
    .eq("id", profile.family_id)
    .single();

  const strategy = (family?.debt_strategy ?? "menor_primeiro") as "menor_primeiro" | "maior_juros";
  const debts = await getDebts(supabase, profile.family_id, strategy);
  const explainer = STRATEGIES.find((s) => s.value === strategy)?.explainer;

  return (
    <div>
      <PageHeader title="Dívidas" name={profile.full_name} avatarColor={profile.avatar_color} />
      <PlanTabs active="/dividas" />

      <div className="mb-3 flex flex-wrap gap-2">
        {STRATEGIES.map((s) => (
          <form key={s.value} action={setDebtStrategy}>
            <input type="hidden" name="strategy" value={s.value} />
            <button
              type="submit"
              className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
                strategy === s.value
                  ? "border-accent-700 bg-accent-700 text-white"
                  : "border-divider text-ink"
              }`}
            >
              {s.label}
            </button>
          </form>
        ))}
      </div>
      {explainer && <p className="mb-5 text-[13px] text-ink-muted">{explainer}</p>}

      <div className="mb-4 flex justify-end">
        <Link href="/dividas/nova" className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink">
          <Plus size={16} strokeWidth={2.25} /> Nova dívida
        </Link>
      </div>

      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
        {debts.map((d) => (
          <Card key={d.id} className="flex flex-col gap-3">
            <Link href={`/dividas/${d.id}`}>
              <h4>{d.name}</h4>
              <p className="text-[13px] tabular-nums text-ink-muted">
                {formatCents(d.remainingCents)} restante · {d.interestRateMonthly}% a.m. · {d.installmentCount}x{" "}
                {formatCents(d.installmentAmountCents)}
              </p>
            </Link>
            <ProgressBar pct={d.paidPct} color="positive" />
            <p className="text-[13px] font-semibold text-positive">{d.paidPct}% pago</p>
            <form action={registerDebtPayment} className="flex items-end gap-2">
              <input type="hidden" name="debt_id" value={d.id} />
              <MoneyField label="Registrar pagamento" name="amount" placeholder="100" />
              <Button type="submit" variant="secondary">
                OK
              </Button>
            </form>
          </Card>
        ))}
        {debts.length === 0 && (
          <Card className="text-[14px] text-ink-muted">Nenhuma dívida cadastrada. 🎉</Card>
        )}
      </div>
    </div>
  );
}
