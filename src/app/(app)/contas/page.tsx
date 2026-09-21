import Link from "next/link";
import { Plus } from "lucide-react";
import { getSessionContext } from "@/lib/session";
import { BackHeader } from "@/components/app/BackHeader";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusPill, type Status } from "@/components/ui/StatusPill";
import { formatCents, billDueLabel } from "@/lib/format";
import { markBillPaid } from "./actions";

const STATUS_PILL: Record<string, Status> = { paga: "positivo", a_vencer: "atencao", atrasada: "negativo" };
const STATUS_LABEL: Record<string, string> = { paga: "Paga", a_vencer: "A vencer", atrasada: "Atrasada" };

export default async function ContasPage() {
  const { supabase, profile } = await getSessionContext();
  const { data: bills } = await supabase
    .from("bills")
    .select("id, name, amount_cents, due_date, paid")
    .eq("family_id", profile.family_id)
    .order("due_date");

  return (
    <div>
      <BackHeader href="/mais" label="Mais" />
      <PageHeader title="Contas a pagar" name={profile.full_name} />
      <div className="mb-4 flex justify-end">
        <Link href="/contas/nova" className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink">
          <Plus size={16} strokeWidth={2.75} /> Nova conta
        </Link>
      </div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
        {(bills ?? []).map((bill) => {
          const { label, status } = billDueLabel(bill.due_date, bill.paid);
          return (
            <Card key={bill.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{bill.name}</p>
                <p className="truncate text-[13px] text-ink-muted">{label}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="font-semibold text-ink">{formatCents(bill.amount_cents)}</span>
                <form action={markBillPaid}>
                  <input type="hidden" name="bill_id" value={bill.id} />
                  <input type="hidden" name="paid" value={(!bill.paid).toString()} />
                  <button type="submit">
                    <StatusPill status={STATUS_PILL[status]}>{STATUS_LABEL[status]}</StatusPill>
                  </button>
                </form>
              </div>
            </Card>
          );
        })}
        {(!bills || bills.length === 0) && (
          <Card className="text-[14px] text-ink-muted">Nenhuma conta cadastrada.</Card>
        )}
      </div>
    </div>
  );
}
