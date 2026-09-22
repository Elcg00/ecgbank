"use client";

import { useActionState } from "react";
import { inviteMember } from "./actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function InviteMemberForm() {
  const [state, formAction, pending] = useActionState(inviteMember, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Field label="E-mail" name="email" type="email" required placeholder="mae@email.com" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Enviando…" : "+ Convidar"}
      </Button>
      {state?.error && <p className="text-[14px] text-negative sm:basis-full">{state.error}</p>}
    </form>
  );
}
