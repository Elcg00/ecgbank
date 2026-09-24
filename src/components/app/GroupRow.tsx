import Link from "next/link";
import { Monogram } from "@/components/ui/Monogram";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusPill, type Status } from "@/components/ui/StatusPill";
import { formatCents } from "@/lib/format";
import { groupStatusLabel, type BudgetGroupSummary } from "@/lib/queries/dashboard";

export const STATUS_TO_PILL: Record<BudgetGroupSummary["status"], Status> = {
  tranquilo: "positivo",
  atencao: "atencao",
  passou: "negativo",
  guardado: "acento",
  sem_limite: "positivo",
};

export const STATUS_TO_BAR: Record<BudgetGroupSummary["status"], "accent" | "positive" | "warning" | "negative"> = {
  tranquilo: "positive",
  atencao: "warning",
  passou: "negative",
  guardado: "accent",
  sem_limite: "accent",
};

export function GroupRow({ group, withPill = true }: { group: BudgetGroupSummary; withPill?: boolean }) {
  return (
    <Link href={`/orcamento/${group.id}`} className="block rounded-card bg-surface p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-3">
        <Monogram label={group.name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate font-semibold text-ink">{group.name}</p>
            {withPill && group.status !== "sem_limite" && (
              <span className="shrink-0">
                <StatusPill status={STATUS_TO_PILL[group.status]}>
                  {groupStatusLabel(group.status, group.pct, group.kind)}
                </StatusPill>
              </span>
            )}
          </div>
          <p className="truncate text-[13px] tabular-nums text-ink-muted">
            {formatCents(group.spentCents)}
            {group.limitCents > 0 && ` / ${formatCents(group.limitCents)}`}
          </p>
        </div>
      </div>
      <ProgressBar pct={group.limitCents > 0 ? group.pct : 0} color={STATUS_TO_BAR[group.status]} />
    </Link>
  );
}
