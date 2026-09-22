import { Card } from "@/components/ui/Card";
import { formatCents } from "@/lib/format";

type CategorySpend = { id: string; name: string; spentCents: number };

const SERIES_COLORS = [
  "var(--chart-series-1)",
  "var(--chart-series-2)",
  "var(--chart-series-3)",
  "var(--chart-series-4)",
  "var(--chart-series-5)",
  "var(--chart-series-6)",
];

/** Part-to-whole spend breakdown for the month, as a stacked bar + legend. */
export function CategorySpendChart({ groups }: { groups: CategorySpend[] }) {
  const sorted = groups.filter((g) => g.spentCents > 0).sort((a, b) => b.spentCents - a.spentCents);
  if (sorted.length === 0) return null;

  const top = sorted.slice(0, 6);
  const restTotal = sorted.slice(6).reduce((s, g) => s + g.spentCents, 0);

  const segments = [
    ...top.map((g, i) => ({ key: g.id, name: g.name, cents: g.spentCents, color: SERIES_COLORS[i] })),
    ...(restTotal > 0 ? [{ key: "outros", name: "Outros", cents: restTotal, color: "var(--chart-other)" }] : []),
  ];
  const total = segments.reduce((s, seg) => s + seg.cents, 0);

  return (
    <Card className="mb-4">
      <h5 className="mb-3">Gasto por categoria</h5>
      <div
        className="flex h-4 w-full gap-0.5 overflow-hidden rounded-full bg-surface"
        role="img"
        aria-label={`Distribuição de gastos por categoria este mês: ${segments
          .map((seg) => `${seg.name} ${Math.round((seg.cents / total) * 100)}%`)
          .join(", ")}`}
      >
        {segments.map((seg) => (
          <div key={seg.key} className="h-full basis-0" style={{ flexGrow: seg.cents, backgroundColor: seg.color }} />
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-2 text-[13px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} aria-hidden />
            <span className="min-w-0 flex-1 truncate text-ink">{seg.name}</span>
            <span className="shrink-0 text-ink-muted">{Math.round((seg.cents / total) * 100)}%</span>
            <span className="shrink-0 font-semibold text-ink">{formatCents(seg.cents)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
