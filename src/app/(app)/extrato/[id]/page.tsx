import { notFound } from "next/navigation";
import { BackHeader } from "@/components/app/BackHeader";
import { getSessionContext } from "@/lib/session";
import { centsToInputValue } from "@/lib/format";
import { EditTransactionForm } from "./EditTransactionForm";

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();

  const [{ data: transaction }, { data: groups }] = await Promise.all([
    supabase
      .from("transactions")
      .select("id, type, amount_cents, budget_group_id, occurred_at")
      .eq("id", id)
      .eq("family_id", profile.family_id)
      .maybeSingle(),
    supabase.from("budget_groups").select("id, name").eq("family_id", profile.family_id).order("sort_order"),
  ]);

  if (!transaction) notFound();

  return (
    <div>
      <BackHeader href="/extrato" label="Extrato" />
      <h1 className="mb-5">Editar lançamento</h1>
      <EditTransactionForm
        transaction={transaction}
        groups={groups ?? []}
        defaultAmount={centsToInputValue(transaction.amount_cents)}
      />
    </div>
  );
}
