import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { BackHeader } from "@/components/app/BackHeader";
import { PageHeader } from "@/components/app/PageHeader";
import { getSessionContext } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { formatCents, nextDayOfMonthLabel } from "@/lib/format";
import { rollCardInstallments } from "@/lib/queries/cardPurchases";

export default async function CartaoPage() {
  const { supabase, profile } = await getSessionContext();
  const { data: cards } = await supabase
    .from("credit_cards")
    .select("id, name, limit_cents, closing_day, due_day")
    .eq("family_id", profile.family_id)
    .order("created_at");

  if (!cards || cards.length === 0) {
    return (
      <div>
        <BackHeader href="/mais" label="Mais" />
        <PageHeader title="Cartão de crédito" name={profile.full_name} avatarColor={profile.avatar_color} />
        <Link href="/cartao/novo">
          <Button>+ Cadastrar cartão</Button>
        </Link>
      </div>
    );
  }

  const cardIds = cards.map((c) => c.id);
  await rollCardInstallments(supabase, cardIds);

  const { data: purchases } = await supabase
    .from("credit_card_purchases")
    .select("id, card_id, amount_cents, installment_current, installment_total")
    .in("card_id", cardIds);

  return (
    <div>
      <BackHeader href="/mais" label="Mais" />
      <PageHeader title="Cartão de crédito" name={profile.full_name} avatarColor={profile.avatar_color} />

      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
        {cards.map((card) => {
          const rows = (purchases ?? []).filter((p) => p.card_id === card.id);
          const invoiceCents = rows.reduce((s, p) => s + p.amount_cents, 0);
          const usedCents = rows.reduce(
            (s, p) => s + p.amount_cents * Math.max(1, p.installment_total - p.installment_current + 1),
            0,
          );
          const usagePct =
            card.limit_cents > 0 ? Math.min(100, Math.round((usedCents / card.limit_cents) * 100)) : 0;

          return (
            <Link key={card.id} href={`/cartao/${card.id}`}>
              <Card className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="min-w-0 truncate">{card.name}</h4>
                  <ChevronRight size={18} className="shrink-0 text-ink-muted" />
                </div>
                <div>
                  <p className="text-[13px] text-ink-muted">Fatura atual</p>
                  <h2 className="tabular-nums">{formatCents(invoiceCents)}</h2>
                </div>
                <ProgressBar pct={usagePct} color={usagePct >= 80 ? "warning" : "accent"} />
                <p className="text-[13px] tabular-nums text-ink-muted">
                  Usado {formatCents(usedCents)} de {formatCents(card.limit_cents)} ({usagePct}%) · vence{" "}
                  {nextDayOfMonthLabel(card.due_day)}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>

      <Link
        href="/cartao/novo"
        className="mt-6 inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink"
      >
        <Plus size={16} strokeWidth={2.25} /> Adicionar outro cartão
      </Link>
    </div>
  );
}
