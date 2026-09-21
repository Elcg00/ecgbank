import { BackHeader } from "@/components/app/BackHeader";
import { getSessionContext } from "@/lib/session";
import { BillForm } from "./BillForm";

export default async function NovaContaPage() {
  const { supabase, profile } = await getSessionContext();
  const { data: groups } = await supabase
    .from("budget_groups")
    .select("id, name")
    .eq("family_id", profile.family_id)
    .order("sort_order");

  return (
    <div>
      <BackHeader href="/contas" label="Contas a pagar" />
      <h1 className="mb-5">Nova conta</h1>
      <BillForm groups={groups ?? []} />
    </div>
  );
}
