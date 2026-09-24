import { formatCents, billDueLabel } from "@/lib/format";
import { StatusPill, type Status } from "@/components/ui/StatusPill";

type Bill = { id: string; name: string; amount_cents: number; due_date: string; paid: boolean };

const STATUS_PILL: Record<string, Status> = {
  paga: "positivo",
  a_vencer: "atencao",
  atrasada: "negativo",
};

const STATUS_LABEL: Record<string, string> = {
  paga: "Paga",
  a_vencer: "A vencer",
  atrasada: "Atrasada",
};

export function BillRow({ bill }: { bill: Bill }) {
  const { label, status } = billDueLabel(bill.due_date, bill.paid);
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{bill.name}</p>
        <p className="truncate text-[13px] text-ink-muted">{label}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-semibold tabular-nums text-ink">{formatCents(bill.amount_cents)}</span>
        <StatusPill status={STATUS_PILL[status]}>{STATUS_LABEL[status]}</StatusPill>
      </div>
    </div>
  );
}
