import Link from "next/link";
import { Download } from "lucide-react";
import { getSessionContext } from "@/lib/session";
import { parseExtratoFilters, hasActiveFilters } from "@/lib/queries/extrato";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { formatCents, formatDate } from "@/lib/format";

const PAYMENT_LABEL: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  debito: "Débito",
  credito: "Crédito",
};

const INCOME_SOURCE_LABEL: Record<string, string> = {
  salario: "Salário",
  extra: "Renda extra",
  reembolso: "Reembolso",
  outro: "Outro",
};

export default async function ExtratoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { supabase, profile } = await getSessionContext();
  const filters = parseExtratoFilters(await searchParams);
  const filtered = hasActiveFilters(filters);

  const [{ data: groups }, { data: members }] = await Promise.all([
    supabase.from("budget_groups").select("id, name").eq("family_id", profile.family_id).order("sort_order"),
    supabase.from("profiles").select("id, full_name").eq("family_id", profile.family_id),
  ]);

  let query = supabase
    .from("transactions")
    .select(
      "id, type, amount_cents, occurred_at, payment_method, income_source, budget_groups(name), profiles(full_name)",
    )
    .eq("family_id", profile.family_id);

  if (filters.group) query = query.eq("budget_group_id", filters.group);
  if (filters.member) query = query.eq("user_id", filters.member);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.from) query = query.gte("occurred_at", filters.from);
  if (filters.to) query = query.lte("occurred_at", filters.to);

  const { data: transactions } = await query
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = transactions ?? [];
  const exportQuery = new URLSearchParams(
    Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();

  return (
    <div>
      <PageHeader title="Extrato" name={profile.full_name} avatarColor={profile.avatar_color} />

      <Card className="mb-4">
        <form className="grid grid-cols-2 gap-3 md:grid-cols-4" method="get">
          <Select label="Categoria" name="group" defaultValue={filters.group ?? ""}>
            <option value="">Todas</option>
            {(groups ?? []).map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
          <Select label="Membro" name="member" defaultValue={filters.member ?? ""}>
            <option value="">Todos</option>
            {(members ?? []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.id === profile.id ? "Você" : m.full_name || "Membro"}
              </option>
            ))}
          </Select>
          <Select label="Tipo" name="type" defaultValue={filters.type ?? ""}>
            <option value="">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink-muted">De</span>
              <input
                type="date"
                name="from"
                defaultValue={filters.from ?? ""}
                className="w-full rounded-full border border-divider bg-app px-3 py-3 text-[14px] text-ink outline-none focus:border-accent-700"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink-muted">Até</span>
              <input
                type="date"
                name="to"
                defaultValue={filters.to ?? ""}
                className="w-full rounded-full border border-divider bg-app px-3 py-3 text-[14px] text-ink outline-none focus:border-accent-700"
              />
            </label>
          </div>
          <div className="col-span-2 flex items-center gap-3 md:col-span-4">
            <Button type="submit" className="flex-1 md:flex-none">
              Filtrar
            </Button>
            {filtered && (
              <Link href="/extrato" className="text-[14px] font-semibold text-ink-muted">
                Limpar filtros
              </Link>
            )}
            <Link
              href={`/extrato/export${exportQuery ? `?${exportQuery}` : ""}`}
              className="ml-auto inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-ink"
            >
              <Download size={16} strokeWidth={2.75} /> Exportar CSV
            </Link>
          </div>
        </form>
      </Card>

      <Card>
        <div className="divide-y divide-divider">
          {rows.map((t) => {
            const group = (t.budget_groups as unknown as { name: string } | null)?.name;
            const member = (t.profiles as unknown as { full_name: string } | null)?.full_name;
            const income = INCOME_SOURCE_LABEL[t.income_source ?? ""];
            const title = t.type === "entrada" ? income ?? "Entrada" : group ?? "Sem categoria";
            const sub = [t.type === "saida" ? PAYMENT_LABEL[t.payment_method ?? ""] : null, member]
              .filter(Boolean)
              .join(" · ");
            return (
              <Link
                key={t.id}
                href={`/extrato/${t.id}`}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{title}</p>
                  <p className="truncate text-[13px] text-ink-muted">{sub || "—"}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <span className={`font-semibold ${t.type === "entrada" ? "text-positive" : "text-negative"}`}>
                    {t.type === "entrada" ? "+" : "-"}
                    {formatCents(t.amount_cents)}
                  </span>
                  <span className="text-[12px] text-ink-muted">{formatDate(t.occurred_at)}</span>
                </div>
              </Link>
            );
          })}
          {rows.length === 0 && (
            <p className="py-2 text-[14px] text-ink-muted">
              {filtered ? "Nenhuma movimentação encontrada com esses filtros." : "Nenhuma movimentação registrada ainda."}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
