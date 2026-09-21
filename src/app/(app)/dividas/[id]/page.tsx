import { notFound } from "next/navigation";
import { BackHeader } from "@/components/app/BackHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { getSessionContext } from "@/lib/session";
import { centsToInputValue } from "@/lib/format";
import { updateDebt, deleteDebt } from "../actions";

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
      <form action={updateDebt} className="flex flex-col gap-4">
        <input type="hidden" name="debt_id" value={debt.id} />
        <Field label="Nome da dívida" name="name" defaultValue={debt.name} required />
        <Field
          label="Valor restante"
          name="remaining"
          inputMode="decimal"
          prefix="R$"
          defaultValue={centsToInputValue(debt.remaining_cents)}
          required
        />
        <Field
          label="Juros ao mês (%)"
          name="interest_rate"
          inputMode="decimal"
          defaultValue={String(debt.interest_rate_monthly)}
        />
        <Field
          label="Número de parcelas"
          name="installment_count"
          inputMode="numeric"
          defaultValue={String(debt.installment_count)}
        />
        <Field
          label="Valor da parcela"
          name="installment_amount"
          inputMode="decimal"
          prefix="R$"
          defaultValue={centsToInputValue(debt.installment_amount_cents)}
        />
        <Button type="submit">Salvar alterações</Button>
      </form>

      <ConfirmForm
        action={deleteDebt}
        confirmMessage={`Excluir a dívida "${debt.name}"?`}
        className="mt-4"
      >
        <input type="hidden" name="debt_id" value={debt.id} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir dívida
        </Button>
      </ConfirmForm>
    </div>
  );
}
