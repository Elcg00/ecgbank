import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { BackHeader } from "@/components/app/BackHeader";
import { PageHeader } from "@/components/app/PageHeader";
import { getSessionContext } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { formatCents, nextDayOfMonthLabel } from "@/lib/format";
import { deletePurchase } from "./actions";
import { PurchaseForm } from "./PurchaseForm";

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
        <PageHeader title="Cartão de crédito" name={profile.full_name} />
        <Link href="/cartao/novo">
          <Button>+ Cadastrar cartão</Button>
        </Link>
      </div>
    );
  }

  const { data: purchases } = await supabase
    .from("credit_card_purchases")
    .select("id, card_id, name, amount_cents, installment_current, installment_total")
    .in(
      "card_id",
      cards.map((c) => c.id),
    )
    .order("created_at");

  return (
    <div>
      <BackHeader href="/mais" label="Mais" />
      <PageHeader title="Cartão de crédito" name={profile.full_name} />

      <div className="flex flex-col gap-6">
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
            <div key={card.id}>
              <div className="mb-3 flex items-center justify-between">
                <h4>{card.name}</h4>
                <Link href={`/cartao/${card.id}`} className="flex items-center gap-1 text-[13px] font-semibold text-accent-ink">
                  <Pencil size={14} strokeWidth={2.75} /> Editar
                </Link>
              </div>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start">
                <Card className="flex flex-col gap-3">
                  <p className="text-[13px] text-ink-muted">
                    Fatura atual · fecha {nextDayOfMonthLabel(card.closing_day)} · vence{" "}
                    {nextDayOfMonthLabel(card.due_day)}
                  </p>
                  <h2>{formatCents(invoiceCents)}</h2>
                  <ProgressBar pct={usagePct} color={usagePct >= 80 ? "warning" : "accent"} />
                  <p className="text-[13px] text-ink-muted">
                    Usado {formatCents(usedCents)} de {formatCents(card.limit_cents)} ({usagePct}%)
                  </p>
                </Card>

                <Card>
                  <h5 className="mb-3">Compras parceladas</h5>
                  <div className="divide-y divide-divider">
                    {rows.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-2 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">{p.name}</p>
                          <p className="text-[13px] text-ink-muted">
                            ({p.installment_current}/{p.installment_total})
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="font-semibold text-ink">{formatCents(p.amount_cents)}</span>
                          <ConfirmForm action={deletePurchase} confirmMessage={`Excluir "${p.name}"?`}>
                            <input type="hidden" name="purchase_id" value={p.id} />
                            <button type="submit" className="text-[12px] font-semibold text-negative">
                              excluir
                            </button>
                          </ConfirmForm>
                        </div>
                      </div>
                    ))}
                    {rows.length === 0 && <p className="py-2 text-[14px] text-ink-muted">Nenhuma compra parcelada.</p>}
                  </div>
                </Card>
              </div>

              <Card className="mt-4">
                <h5 className="mb-3">Nova compra parcelada</h5>
                <PurchaseForm cardId={card.id} />
              </Card>
            </div>
          );
        })}
      </div>

      <Link
        href="/cartao/novo"
        className="mt-6 inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink"
      >
        <Plus size={16} strokeWidth={2.75} /> Adicionar outro cartão
      </Link>
    </div>
  );
}
