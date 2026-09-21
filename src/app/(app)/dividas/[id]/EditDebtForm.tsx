"use client";

import { useActionState } from "react";
import { updateDebt, deleteDebt } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

type Debt = {
  id: string;
  name: string;
  interest_rate_monthly: number;
  installment_count: number;
};

export function EditDebtForm({
  debt,
  defaultRemaining,
  defaultInstallmentAmount,
}: {
  debt: Debt;
  defaultRemaining: string;
  defaultInstallmentAmount: string;
}) {
  const [state, formAction, pending] = useActionState(updateDebt, undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="debt_id" value={debt.id} />
        <Field label="Nome da dívida" name="name" defaultValue={debt.name} required />
        <Field
          label="Valor restante"
          name="remaining"
          inputMode="decimal"
          prefix="R$"
          defaultValue={defaultRemaining}
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
          defaultValue={defaultInstallmentAmount}
        />
        {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </form>

      <ConfirmForm action={deleteDebt} confirmMessage={`Excluir a dívida "${debt.name}"?`} className="mt-4">
        <input type="hidden" name="debt_id" value={debt.id} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir dívida
        </Button>
      </ConfirmForm>
    </div>
  );
}
