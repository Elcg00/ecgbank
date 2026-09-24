import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function OnboardingHeader({ step }: { step: number }) {
  const pct = (step / 7) * 100;
  return (
    <div className="mb-8 flex items-center gap-3">
      {step > 1 ? (
        <Link href={`/onboarding/${step - 1}`} aria-label="Voltar" className="text-ink-muted">
          <ChevronLeft size={22} strokeWidth={2.25} />
        </Link>
      ) : (
        <span className="w-[22px]" />
      )}
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-accent-700 transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <span className="whitespace-nowrap text-[13px] font-semibold text-ink-muted">
        Passo {step} de 7
      </span>
    </div>
  );
}
