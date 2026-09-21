import { BackHeader } from "@/components/app/BackHeader";
import { PageHeader } from "@/components/app/PageHeader";
import { getSessionContext } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { formatCents, nextDayOfMonthLabel } from "@/lib/format";
import { createCard, createPurchase } from "./actions";

export default async function CartaoPage() {
  const { supabase, profile } = await getSessionContext();
  const { data: card } = await supabase
    .from("credit_cards")
    .select("id, name, limit_cents, closing_day, due_day")
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!card) {
    return (
      <div>
        <BackHeader href="/mais" label="Mais" />
        <PageHeader title="Cartão de crédito" name={profile.full_name} />
        <Card>
          <h5 className="mb-3">Cadastre seu cartão</h5>
          <form action={createCard} className="flex flex-col gap-4">
            <Field label="Nome do cartão" name="name" placeholder="Cartão" defaultValue="Cartão" />
            <Field label="Limite" name="limit" inputMode="numeric" prefix="R$" placeholder="3.000" />
            <Field label="Dia de fechamento" name="closing_day" inputMode="numeric" placeholder="15" defaultValue="15" />
            <Field label="Dia de vencimento" name="due_day" inputMode="numeric" placeholder="5" defaultValue="5" />
            <Button type="submit">Cadastrar cartão</Button>
          </form>
        </Card>
      </div>
    );
  }

  const { data: purchases } = await supabase
    .from("credit_card_purchases")
    .select("id, name, amount_cents, installment_current, installment_total")
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
      <BackHeader href="/mais" label="Mais" />
      <PageHeader title="Cartão de crédito" name={profile.full_name} />
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start">
        <Card className="flex flex-col gap-3">
          <p className="text-[13px] text-ink-muted">
            Fatura atual · fecha {nextDayOfMonthLabel(card.closing_day)} · vence {nextDayOfMonthLabel(card.due_day)}
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
              <div key={p.id} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{p.name}</p>
                  <p className="text-[13px] text-ink-muted">
                    ({p.installment_current}/{p.installment_total})
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-ink">{formatCents(p.amount_cents)}</span>
              </div>
            ))}
            {rows.length === 0 && <p className="py-2 text-[14px] text-ink-muted">Nenhuma compra parcelada.</p>}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h5 className="mb-3">Nova compra parcelada</h5>
        <form action={createPurchase} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="card_id" value={card.id} />
          <Field label="Nome da compra" name="name" required placeholder="Notebook" />
          <Field label="Valor da parcela" name="amount" inputMode="numeric" prefix="R$" required placeholder="210" />
          <Field label="Parcela atual" name="installment_current" inputMode="numeric" placeholder="4" defaultValue="1" />
          <Field label="Total de parcelas" name="installment_total" inputMode="numeric" placeholder="10" defaultValue="1" />
          <Button type="submit" className="sm:col-span-2">
            Adicionar compra
          </Button>
        </form>
      </Card>
    </div>
  );
}
