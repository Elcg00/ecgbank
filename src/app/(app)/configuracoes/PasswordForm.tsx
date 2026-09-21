"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/(auth)/actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Field
        label="Nova senha"
        name="password"
        type="password"
        minLength={6}
        autoComplete="new-password"
        required
      />
      {state?.error && <p className="text-[13px] text-negative">{state.error}</p>}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Salvando…" : "Trocar senha"}
      </Button>
    </form>
  );
}
