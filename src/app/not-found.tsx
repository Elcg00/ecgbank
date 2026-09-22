import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-app px-5 text-center">
      <span className="font-heading text-2xl text-accent-ink">ECG BANK</span>
      <h1>Página não encontrada</h1>
      <p className="max-w-xs text-ink-muted">O endereço que você tentou acessar não existe ou foi movido.</p>
      <Link href="/">
        <Button>Voltar para o início</Button>
      </Link>
    </div>
  );
}
