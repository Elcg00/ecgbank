"use client";

import { useActionState } from "react";
import { updatePassword } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export default function UpdatePasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <div>
      <h1 className="mb-1 text-center">Crie uma nova senha</h1>
      <p className="mb-6 text-center text-ink-muted">Escolha uma senha nova para sua conta.</p>
      <form action={formAction} className="flex flex-col gap-4">
        <Field
          label="Nova senha"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
        {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Salvando…" : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );
}
