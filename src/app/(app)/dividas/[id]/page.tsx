import { notFound } from "next/navigation";
import { BackHeader } from "@/components/app/BackHeader";
import { getSessionContext } from "@/lib/session";
import { centsToInputValue } from "@/lib/format";
import { EditDebtForm } from "./EditDebtForm";

export default async function EditDebtPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();

  const { data: debt } = await supabase
    .from("debts")
    .select("id, name, remaining_cents, interest_rate_monthly, installment_count, installment_amount_cents")
    .eq("id", id)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!debt) notFound();

  return (
    <div>
      <BackHeader href="/dividas" label="Dívidas" />
      <h1 className="mb-5">Editar dívida</h1>
      <EditDebtForm
        debt={debt}
        defaultRemaining={centsToInputValue(debt.remaining_cents)}
        defaultInstallmentAmount={centsToInputValue(debt.installment_amount_cents)}
      />
    </div>
  );
}
