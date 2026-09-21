import { getSessionContext } from "@/lib/session";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { formatCents, formatDate } from "@/lib/format";

const PAYMENT_LABEL: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  debito: "Débito",
  credito: "Crédito",
};

export default async function ExtratoPage() {
  const { supabase, profile } = await getSessionContext();

  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      "id, type, amount_cents, occurred_at, payment_method, budget_groups(name), profiles(full_name)",
    )
    .eq("family_id", profile.family_id)
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = transactions ?? [];

  return (
    <div>
      <PageHeader title="Extrato" name={profile.full_name} />
      <Card tint="accent2" className="mb-4">
        <p className="text-[14px] text-ink">
          Em breve: filtros por categoria, membro e período. Por enquanto, aqui está tudo que vocês
          lançaram recentemente.
        </p>
      </Card>
      <Card>
        <div className="divide-y divide-divider">
          {rows.map((t) => {
            const group = (t.budget_groups as unknown as { name: string } | null)?.name;
            const member = (t.profiles as unknown as { full_name: string } | null)?.full_name;
            const sub = [group, PAYMENT_LABEL[t.payment_method ?? ""], member].filter(Boolean).join(" · ");
            return (
              <div key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{group ?? "Sem categoria"}</p>
                  <p className="truncate text-[13px] text-ink-muted">{sub || "—"}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <span className={`font-semibold ${t.type === "entrada" ? "text-positive" : "text-negative"}`}>
                    {t.type === "entrada" ? "+" : "-"}
                    {formatCents(t.amount_cents)}
                  </span>
                  <span className="text-[12px] text-ink-muted">{formatDate(t.occurred_at)}</span>
                </div>
              </div>
            );
          })}
          {rows.length === 0 && (
            <p className="py-2 text-[14px] text-ink-muted">Nenhuma movimentação registrada ainda.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
