"use client";

import { useActionState } from "react";
import { updateGroup, deleteGroup } from "../actions";
import { Field } from "@/components/ui/Field";
import { MoneyField } from "@/components/ui/MoneyField";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

export function EditGroupForm({
  groupId,
  name,
  defaultLimit,
}: {
  groupId: string;
  name: string;
  defaultLimit: string;
}) {
  const [state, formAction, pending] = useActionState(updateGroup, undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="group_id" value={groupId} />
        <Field label="Nome" name="name" defaultValue={name} required />
        <MoneyField label="Limite mensal" name="limit" defaultValue={defaultLimit} placeholder="0" />
        {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </form>

      <ConfirmForm
        action={deleteGroup}
        confirmMessage={`Excluir o grupo "${name}"? Os lançamentos já feitos continuam no extrato, só perdem a categoria.`}
        className="mt-4"
      >
        <input type="hidden" name="group_id" value={groupId} />
        <Button type="submit" variant="danger" className="w-full">
          Excluir grupo
        </Button>
      </ConfirmForm>
    </div>
  );
}
