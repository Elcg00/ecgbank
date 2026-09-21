"use client";

import { useActionState } from "react";
import { updateName } from "./actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function NameForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, pending] = useActionState(updateName, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Field label="Seu nome" name="full_name" defaultValue={defaultName} required />
      {state?.error && <p className="text-[13px] text-negative">{state.error}</p>}
      {state?.saved && <p className="text-[13px] text-positive">Nome atualizado!</p>}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Salvando…" : "Salvar nome"}
      </Button>
    </form>
  );
}
