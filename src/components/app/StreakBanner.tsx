import { Card } from "@/components/ui/Card";

export function StreakBanner({ streak }: { streak: number }) {
  if (streak >= 2) {
    return (
      <Card tint="accent2" className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>
          🔥
        </span>
        <p className="text-[14px] font-semibold text-ink">
          Boa! Você registrou gastos <span className="text-accent2-800 dark:text-accent2-300">{streak} dias seguidos</span> 🎉
        </p>
      </Card>
    );
  }

  return (
    <Card tint="accent2" className="flex items-center gap-3">
      <span className="text-2xl" aria-hidden>
        ✍️
      </span>
      <p className="text-[14px] font-semibold text-ink">
        Registre um gasto hoje para começar sua sequência.
      </p>
    </Card>
  );
}
