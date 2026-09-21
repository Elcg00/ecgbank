"use client";

import { useActionState } from "react";
import { signUp } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Seu nome" name="full_name" required autoComplete="name" placeholder="Ana" />
      <Field label="E-mail" name="email" type="email" required autoComplete="email" placeholder="voce@email.com" />
      <Field
        label="Senha"
        name="password"
        type="password"
        required
        minLength={6}
        autoComplete="new-password"
        placeholder="Mínimo de 6 caracteres"
      />
      {state?.error && <p className="text-[14px] text-negative">{state.error}</p>}
      <Button type="submit" disabled={pending} className="mt-1 w-full">
        {pending ? "Criando conta…" : "Criar conta"}
      </Button>
    </form>
  );
}
