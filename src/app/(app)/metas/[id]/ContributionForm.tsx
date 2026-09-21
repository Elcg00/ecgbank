"use client";

import { useActionState } from "react";
import { setContribution } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ContributionForm({ goalId, defaultAmount }: { goalId: string; defaultAmount: string }) {
  const [, formAction, pending] = useActionState(setContribution, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="goal_id" value={goalId} />
      <Field
        label="Valor guardado por você"
        name="amount"
        inputMode="decimal"
        prefix="R$"
        defaultValue={defaultAmount}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando…" : "Salvar"}
      </Button>
    </form>
  );
}
