"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-app px-5 text-center">
      <span className="font-heading text-2xl text-accent-ink">ECG BANK</span>
      <h1>Algo deu errado</h1>
      <p className="max-w-xs text-ink-muted">
        Não foi possível carregar essa tela. Tente de novo — se continuar, avise a gente.
      </p>
      <Button onClick={() => reset()}>Tentar de novo</Button>
    </div>
  );
}
