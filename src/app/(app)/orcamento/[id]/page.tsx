import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionContext } from "@/lib/session";
import { getMonthSummary, getBudgetGroups, groupStatusLabel, monthRange } from "@/lib/queries/dashboard";
import { BackHeader } from "@/components/app/BackHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCents, formatDate, centsToInputValue } from "@/lib/format";
import { EditGroupForm } from "./EditGroupForm";

const PAYMENT_LABEL: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  debito: "Débito",
  credito: "Crédito",
};

export default async function BudgetGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();
  const { spentByGroup } = await getMonthSummary(supabase, profile.family_id);
  const groups = await getBudgetGroups(supabase, profile.family_id, spentByGroup);
  const group = groups.find((g) => g.id === id);

  if (!group) notFound();

  const { start, end } = monthRange();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, amount_cents, occurred_at, payment_method, profiles(full_name)")
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
      <h1 className="mb-5">{group.name}</h1>
      <Card className="mb-4 flex flex-col gap-3">
        <ProgressBar pct={group.limitCents > 0 ? group.pct : 0} />
        <p className="text-[14px] text-ink-muted">
          {formatCents(group.spentCents)}
          {group.limitCents > 0 && ` de ${formatCents(group.limitCents)}`} gastos este mês
        </p>
        {group.limitCents > 0 && (
          <p className="text-[14px] font-semibold text-ink">
            {groupStatusLabel(group.status, group.pct, group.kind)}
          </p>
        )}
      </Card>

      <Card className="mb-4">
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
                  {PAYMENT_LABEL[t.payment_method ?? ""] ?? "Gasto"}
                  {member && <span className="text-ink-muted"> · {member}</span>}
                </p>
                <div className="flex shrink-0 flex-col items-end">
                  <span className="font-semibold text-negative">-{formatCents(t.amount_cents)}</span>
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

      <Card>
        <h5 className="mb-3">Editar grupo</h5>
        <EditGroupForm
          groupId={group.id}
          name={group.name}
          defaultLimit={group.limitCents > 0 ? centsToInputValue(group.limitCents) : ""}
        />
      </Card>
    </div>
  );
}
