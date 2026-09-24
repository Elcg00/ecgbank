import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCents, monthsUntil } from "@/lib/format";

export type GoalSummary = {
  id: string;
  name: string;
  target_cents: number;
  deadline: string | null;
  shared: boolean;
  monthly_target_cents: number;
  savedCents: number;
  contributions: { userId: string; name: string; amountCents: number }[];
};

export function GoalCard({ goal, compact = false }: { goal: GoalSummary; compact?: boolean }) {
  const pct = goal.target_cents > 0 ? Math.min(100, Math.round((goal.savedCents / goal.target_cents) * 100)) : 0;
  const months = monthsUntil(goal.deadline);

  return (
    <Link href={`/metas/${goal.id}`} className="block">
      <Card className={compact ? "" : "flex flex-col gap-3"}>
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-ink">{goal.name}</h4>
          {months !== null && (
            <span className="whitespace-nowrap text-[12px] font-semibold text-ink-muted">
              {months} {months === 1 ? "mês" : "meses"}
            </span>
          )}
        </div>
        <ProgressBar pct={pct} color="accent" />
        <p className="text-[13px] tabular-nums text-ink-muted">
          {formatCents(goal.savedCents)} de {formatCents(goal.target_cents)}
          {goal.monthly_target_cents > 0 && ` · guarde ${formatCents(goal.monthly_target_cents)}/mês`}
        </p>
        {goal.shared && goal.contributions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {goal.contributions.map((c) => (
              <span
                key={c.userId}
                className="rounded-full bg-surface-2 px-3 py-1 text-[12px] font-semibold tabular-nums text-ink-muted"
              >
                {c.name}: {formatCents(c.amountCents)}
              </span>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}
