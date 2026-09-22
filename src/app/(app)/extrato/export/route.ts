import { NextResponse, type NextRequest } from "next/server";
import { getSessionContext } from "@/lib/session";
import { parseExtratoFilters } from "@/lib/queries/extrato";
import { centsToInputValue } from "@/lib/format";

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

function csvField(value: string): string {
  if (/[",\n;]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(request: NextRequest) {
  const { supabase, profile } = await getSessionContext();
  const filters = parseExtratoFilters(Object.fromEntries(request.nextUrl.searchParams));

  let query = supabase
    .from("transactions")
    .select(
      "type, amount_cents, occurred_at, payment_method, income_source, note, budget_groups(name), profiles(full_name)",
    )
    .eq("family_id", profile.family_id);

  if (filters.q) query = query.ilike("note", `%${filters.q}%`);
  if (filters.group) query = query.eq("budget_group_id", filters.group);
  if (filters.member) query = query.eq("user_id", filters.member);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.from) query = query.gte("occurred_at", filters.from);
  if (filters.to) query = query.lte("occurred_at", filters.to);

  const { data: transactions } = await query
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5000);

  const header = ["Data", "Tipo", "Categoria", "Nota", "Membro", "Forma de pagamento", "Valor"];
  const lines = [header.map(csvField).join(";")];

  for (const t of transactions ?? []) {
    const group = (t.budget_groups as unknown as { name: string } | null)?.name;
    const member = (t.profiles as unknown as { full_name: string } | null)?.full_name ?? "";
    const category = t.type === "entrada" ? (INCOME_SOURCE_LABEL[t.income_source ?? ""] ?? "Entrada") : group ?? "Sem categoria";
    const payment = t.payment_method ? PAYMENT_LABEL[t.payment_method] ?? "" : "";
    const amount = (t.type === "entrada" ? "" : "-") + centsToInputValue(t.amount_cents);

    lines.push(
      [t.occurred_at, t.type === "entrada" ? "Entrada" : "Saída", category, t.note ?? "", member, payment, amount]
        .map(csvField)
        .join(";"),
    );
  }

  return new NextResponse(`﻿${lines.join("\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="extrato.csv"',
    },
  });
}
