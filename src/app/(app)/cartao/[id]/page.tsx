import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { BackHeader } from "@/components/app/BackHeader";
import { getSessionContext } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCents, nextDayOfMonthLabel } from "@/lib/format";
import { rollCardInstallments } from "@/lib/queries/cardPurchases";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { deletePurchase } from "../actions";

export default async function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();

  const { data: card } = await supabase
    .from("credit_cards")
    .select("id, name, limit_cents, closing_day, due_day")
    .eq("id", id)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!card) notFound();

  await rollCardInstallments(supabase, [card.id]);

  const { data: purchases } = await supabase
    .from("credit_card_purchases")
    .select("id, name, amount_cents, installment_current, installment_total, budget_groups(name)")
    .eq("card_id", card.id)
    .order("created_at");

  const rows = purchases ?? [];
  const invoiceCents = rows.reduce((s, p) => s + p.amount_cents, 0);
  const usedCents = rows.reduce(
    (s, p) => s + p.amount_cents * Math.max(1, p.installment_total - p.installment_current + 1),
    0,
  );
  const usagePct = card.limit_cents > 0 ? Math.min(100, Math.round((usedCents / card.limit_cents) * 100)) : 0;

  return (
    <div>
      <BackHeader href="/cartao" label="Cartão de crédito" />

      <div className="mb-5 flex items-center justify-between gap-3">
        <h1>{card.name}</h1>
        <Link
          href={`/cartao/${card.id}/editar`}
          className="inline-flex items-center gap-1.5 rounded-full border border-divider px-4 py-2 text-[14px] font-semibold text-ink hover:bg-surface-2"
        >
          <Pencil size={15} strokeWidth={2.25} /> Editar
        </Link>
      </div>

      <Card className="mb-4 flex flex-col gap-3">
        <p className="text-[13px] text-ink-muted">
          Fatura atual · fecha {nextDayOfMonthLabel(card.closing_day)} · vence {nextDayOfMonthLabel(card.due_day)}
        </p>
        <h2 className="tabular-nums">{formatCents(invoiceCents)}</h2>
        <ProgressBar pct={usagePct} color={usagePct >= 80 ? "warning" : "accent"} />
        <p className="text-[13px] tabular-nums text-ink-muted">
          Usado {formatCents(usedCents)} de {formatCents(card.limit_cents)} ({usagePct}%)
        </p>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h5>Compras parceladas</h5>
          <Link
            href={`/cartao/${card.id}/nova-compra`}
            className="flex items-center gap-1 text-[13px] font-semibold text-accent-ink"
          >
            <Plus size={14} strokeWidth={2.25} /> Nova compra
          </Link>
        </div>
        <div className="divide-y divide-divider">
          {rows.map((p) => {
            const groupName = (p.budget_groups as unknown as { name: string } | null)?.name;
            return (
              <div key={p.id} className="flex items-center justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{p.name}</p>
                  <p className="truncate text-[13px] text-ink-muted">
                    ({p.installment_current}/{p.installment_total}){groupName ? ` · ${groupName}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-semibold tabular-nums text-ink">{formatCents(p.amount_cents)}</span>
                  <Link href={`/cartao/${card.id}/compra/${p.id}`} className="text-[12px] font-semibold text-accent-ink">
                    editar
                  </Link>
                  <ConfirmForm action={deletePurchase} confirmMessage={`Excluir "${p.name}"?`}>
                    <input type="hidden" name="purchase_id" value={p.id} />
                    <input type="hidden" name="card_id" value={card.id} />
                    <button type="submit" className="text-[12px] font-semibold text-negative">
                      excluir
                    </button>
                  </ConfirmForm>
                </div>
              </div>
            );
          })}
          {rows.length === 0 && <p className="py-2 text-[14px] text-ink-muted">Nenhuma compra parcelada.</p>}
        </div>
      </Card>
    </div>
  );
}
