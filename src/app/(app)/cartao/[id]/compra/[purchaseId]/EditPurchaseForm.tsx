"use client";

import { useActionState } from "react";
import { updatePurchase, deletePurchase } from "../../../actions";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

type Purchase = {
  id: string;
  name: string;
  installment_current: number;
  installment_total: number;
  budget_group_id: string | null;
};
type Group = { id: string; name: string };

export function EditPurchaseForm({
  cardId,
  purchase,
  groups,
  defaultAmount,
}: {
  cardId: string;
  purchase: Purchase;
  groups: Group[];
  defaultAmount: string;
}) {
  const [state, formAction, pending] = useActionState(updatePurchase, undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="purchase_id" value={purchase.id} />
        <input type="hidden" name="card_id" value={cardId} />
        <Field label="Nome da compra" name="name" defaultValue={purchase.name} required />
        <Field
          label="Valor total da compra"
          name="amount"
          inputMode="decimal"
          prefix="R$"
          defaultValue={defaultAmount}
          required
        />
        <Field
          label="Parcela atual"
          name="installment_current"
          inputMode="numeric"
          defaultValue={String(purchase.installment_current)}
        />
        <Field
          label="Total de parcelas"
          name="installment_total"
          inputMode="numeric"
          defaultValue={String(purchase.installment_total)}
        />
        {groups.length > 0 && (
          <Select label="Categoria (opcional)" name="budget_group_id" defaultValue={purchase.budget_group_id ?? ""}>
            <option value="">Sem categoria</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        )}
        {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </form>

      <ConfirmForm action={deletePurchase} confirmMessage={`Excluir "${purchase.name}"?`} className="mt-4">
        <input type="hidden" name="purchase_id" value={purchase.id} />
        <input type="hidden" name="card_id" value={cardId} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir compra
        </Button>
      </ConfirmForm>
    </div>
  );
}
