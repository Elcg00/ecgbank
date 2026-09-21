import Link from "next/link";
import { SignUpForm } from "./SignUpForm";

export default function SignUpPage() {
  return (
    <div>
      <h1 className="mb-1 text-center">Criar sua conta</h1>
      <p className="mb-6 text-center text-ink-muted">
        Comece a organizar as finanças com quem você ama, sem julgamento.
      </p>
      <SignUpForm />
      <p className="mt-5 text-center text-[14px] text-ink-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-accent-ink hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
