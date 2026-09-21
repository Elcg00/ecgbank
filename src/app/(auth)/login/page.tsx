import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-1 text-center">Bem-vindo(a) de volta</h1>
      <p className="mb-6 text-center text-ink-muted">
        Entre para continuar organizando as finanças da família.
      </p>
      <LoginForm />
      <div className="mt-5 flex flex-col items-center gap-2 text-[14px]">
        <Link href="/esqueci-senha" className="text-accent-ink hover:underline">
          Esqueci minha senha
        </Link>
        <p className="text-ink-muted">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-accent-ink hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
