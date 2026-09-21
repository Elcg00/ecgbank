import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type GroupStatus = "tranquilo" | "atencao" | "passou" | "guardado" | "sem_limite";

export type BudgetGroupSummary = {
  id: string;
  name: string;
  monogram: string;
  kind: "spending" | "saving";
  limitCents: number;
  spentCents: number;
  pct: number;
  status: GroupStatus;
};

export function groupStatus(kind: "spending" | "saving", limitCents: number, spentCents: number): {
  pct: number;
  status: GroupStatus;
} {
  if (limitCents <= 0) return { pct: 0, status: "sem_limite" };
  const pct = Math.round((spentCents / limitCents) * 100);

  if (kind === "saving") {
    return { pct, status: pct >= 100 ? "guardado" : "tranquilo" };
  }
  if (pct >= 100) return { pct, status: "passou" };
  if (pct >= 80) return { pct, status: "atencao" };
  return { pct, status: "tranquilo" };
}

export function monthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { start: iso(start), end: iso(end) };
}

export async function getMonthSummary(supabase: SupabaseClient, familyId: string) {
  const { start, end } = monthRange();
  const { data: txs } = await supabase
    .from("transactions")
    .select("type, amount_cents, budget_group_id")
    .eq("family_id", familyId)
    .gte("occurred_at", start)
    .lt("occurred_at", end);

  const rows = txs ?? [];
  const entradasCents = rows.filter((t) => t.type === "entrada").reduce((s, t) => s + t.amount_cents, 0);
  const saidasCents = rows.filter((t) => t.type === "saida").reduce((s, t) => s + t.amount_cents, 0);

  const spentByGroup = new Map<string, number>();
  for (const t of rows) {
    if (t.type !== "saida" || !t.budget_group_id) continue;
    spentByGroup.set(t.budget_group_id, (spentByGroup.get(t.budget_group_id) ?? 0) + t.amount_cents);
  }

  return { entradasCents, saidasCents, saldoCents: entradasCents - saidasCents, spentByGroup };
}

export async function getBudgetGroups(
  supabase: SupabaseClient,
  familyId: string,
  spentByGroup: Map<string, number>,
): Promise<BudgetGroupSummary[]> {
  const { data } = await supabase
    .from("budget_groups")
    .select("id, name, monogram, kind, limit_cents")
    .eq("family_id", familyId)
    .order("sort_order");

  return (data ?? []).map((g) => {
    const spentCents = spentByGroup.get(g.id) ?? 0;
    const { pct, status } = groupStatus(g.kind, g.limit_cents, spentCents);
    return {
      id: g.id,
      name: g.name,
      monogram: g.monogram,
      kind: g.kind,
      limitCents: g.limit_cents,
      spentCents,
      pct,
      status,
    };
  });
}

export function groupStatusLabel(status: GroupStatus, pct: number, kind: "spending" | "saving"): string {
  switch (status) {
    case "tranquilo":
      return kind === "saving" ? `Guardando · ${pct}%` : "Tranquilo";
    case "atencao":
      return `Atenção: ${pct}%`;
    case "passou":
      return `Passou ${pct - 100}%`;
    case "guardado":
      return "Guardado!";
    case "sem_limite":
    default:
      return "Sem limite definido";
  }
}

export async function getLoggingStreak(supabase: SupabaseClient, familyId: string): Promise<number> {
  const { data } = await supabase
    .from("transactions")
    .select("occurred_at")
    .eq("family_id", familyId)
    .order("occurred_at", { ascending: false })
    .limit(200);

  const days = Array.from(new Set((data ?? []).map((t) => t.occurred_at))).sort().reverse();
  if (days.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cursor = new Date(today);

  // Allow the streak to still count if today has no entry yet but yesterday does.
  if (days[0] !== cursor.toISOString().slice(0, 10)) {
    cursor.setDate(cursor.getDate() - 1);
    if (days[0] !== cursor.toISOString().slice(0, 10)) return 0;
  }

  let streak = 0;
  for (const day of days) {
    const expected = cursor.toISOString().slice(0, 10);
    if (day !== expected) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
