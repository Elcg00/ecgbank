"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  if (state?.sent) {
    return (
      <div className="text-center">
        <h1 className="mb-2">Verifique seu e-mail</h1>
        <p className="text-ink-muted">
          Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-center">Redefinir senha</h1>
      <p className="mb-6 text-center text-ink-muted">
        Informe seu e-mail e enviaremos um link para você criar uma nova senha.
      </p>
      <form action={formAction} className="flex flex-col gap-4">
        <Field label="E-mail" name="email" type="email" required autoComplete="email" />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Enviando…" : "Enviar link"}
        </Button>
      </form>
      <p className="mt-5 text-center text-[14px] text-ink-muted">
        <Link href="/login" className="font-semibold text-accent-ink hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
