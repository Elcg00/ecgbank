import { notFound } from "next/navigation";
import { BackHeader } from "@/components/app/BackHeader";
import { getSessionContext } from "@/lib/session";
import { centsToInputValue } from "@/lib/format";
import { EditBillForm } from "./EditBillForm";

export default async function EditBillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();

  const [{ data: bill }, { data: groups }] = await Promise.all([
    supabase
      .from("bills")
      .select("id, name, amount_cents, due_date, recurring, budget_group_id")
      .eq("id", id)
      .eq("family_id", profile.family_id)
      .maybeSingle(),
    supabase.from("budget_groups").select("id, name").eq("family_id", profile.family_id).order("sort_order"),
  ]);

  if (!bill) notFound();

  return (
    <div>
      <BackHeader href="/contas" label="Contas a pagar" />
      <h1 className="mb-5">Editar conta</h1>
      <EditBillForm bill={bill} groups={groups ?? []} defaultAmount={centsToInputValue(bill.amount_cents)} />
    </div>
  );
}
