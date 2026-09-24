import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { getSessionContext } from "@/lib/session";
import { getMonthSummary, getBudgetGroups, groupStatusLabel, monthRange } from "@/lib/queries/dashboard";
import { BackHeader } from "@/components/app/BackHeader";
import { Monogram } from "@/components/ui/Monogram";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCents, formatDate } from "@/lib/format";
import { STATUS_TO_BAR } from "@/components/app/GroupRow";

const PAYMENT_LABEL: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  debito: "Débito",
  credito: "Crédito",
};

const STATUS_TEXT_COLOR: Record<string, string> = {
  tranquilo: "text-positive",
  atencao: "text-warning",
  passou: "text-negative",
  guardado: "text-accent-ink",
  sem_limite: "text-ink-muted",
};

export default async function BudgetGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();
  const { spentByGroup } = await getMonthSummary(supabase, profile.family_id);
  const groups = await getBudgetGroups(supabase, profile.family_id, spentByGroup);
  const group = groups.find((g) => g.id === id);

  if (!group) notFound();

  const remainingCents = group.limitCents - group.spentCents;

  const { start, end } = monthRange();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, amount_cents, occurred_at, payment_method, note, profiles(full_name)")
    .eq("family_id", profile.family_id)
    .eq("budget_group_id", id)
    .eq("type", "saida")
    .gte("occurred_at", start)
    .lt("occurred_at", end)
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <BackHeader href="/orcamento" label="Orçamento" />

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Monogram label={group.name} size="lg" />
          <h1>{group.name}</h1>
        </div>
        <Link
          href={`/orcamento/${group.id}/editar`}
          className="inline-flex items-center gap-1.5 rounded-full border border-divider px-4 py-2 text-[14px] font-semibold text-ink hover:bg-surface-2"
        >
          <Pencil size={15} strokeWidth={2.25} /> Editar
        </Link>
      </div>

      <Card className="mb-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[13px] text-ink-muted">Gasto este mês</p>
            <h2 className="tabular-nums">{formatCents(group.spentCents)}</h2>
          </div>
          {group.limitCents > 0 && (
            <div className="text-right">
              <p className={`text-[22px] font-bold tabular-nums ${STATUS_TEXT_COLOR[group.status]}`}>{group.pct}%</p>
              <p className={`text-[13px] font-semibold ${STATUS_TEXT_COLOR[group.status]}`}>
                {groupStatusLabel(group.status, group.pct, group.kind)}
              </p>
            </div>
          )}
        </div>
        <ProgressBar
          pct={group.limitCents > 0 ? group.pct : 0}
          color={STATUS_TO_BAR[group.status]}
          className="h-3"
        />
        {group.limitCents > 0 && (
          <div className="mt-3 flex items-center justify-between text-[13px] tabular-nums text-ink-muted">
            <span>Limite de {formatCents(group.limitCents)}</span>
            <span className={remainingCents < 0 ? "font-semibold text-negative" : ""}>
              {remainingCents >= 0
                ? `Restam ${formatCents(remainingCents)}`
                : `Passou ${formatCents(-remainingCents)}`}
            </span>
          </div>
        )}
      </Card>

      <Card>
        <h5 className="mb-3">Com o que foi gasto</h5>
        <div className="divide-y divide-divider">
          {(transactions ?? []).map((t) => {
            const member = (t.profiles as unknown as { full_name: string } | null)?.full_name;
            return (
              <Link
                key={t.id}
                href={`/extrato/${t.id}`}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <p className="truncate text-[14px] text-ink">
                  {t.note || PAYMENT_LABEL[t.payment_method ?? ""] || "Gasto"}
                  {member && <span className="text-ink-muted"> · {member}</span>}
                </p>
                <div className="flex shrink-0 flex-col items-end">
                  <span className="font-semibold tabular-nums text-negative">-{formatCents(t.amount_cents)}</span>
                  <span className="text-[12px] text-ink-muted">{formatDate(t.occurred_at)}</span>
                </div>
              </Link>
            );
          })}
          {(!transactions || transactions.length === 0) && (
            <p className="py-2 text-[14px] text-ink-muted">Nenhum gasto neste grupo ainda este mês.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
