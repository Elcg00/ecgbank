import Link from "next/link";
import { getSessionContext } from "@/lib/session";
import { getMonthSummary, getBudgetGroups, getLoggingStreak } from "@/lib/queries/dashboard";
import { getGoals } from "@/lib/queries/goals";
import { rollRecurringBills } from "@/lib/queries/bills";
import { tipOfTheDay } from "@/lib/tips";
import { formatCents } from "@/lib/format";
import { PageHeader } from "@/components/app/PageHeader";
import { GroupRow } from "@/components/app/GroupRow";
import { StreakBanner } from "@/components/app/StreakBanner";
import { BillRow } from "@/components/app/BillRow";
import { GoalCard } from "@/components/app/GoalCard";
import { Card } from "@/components/ui/Card";
import { ArrowUp, ArrowDown } from "lucide-react";

export default async function DashboardPage() {
  const { supabase, profile } = await getSessionContext();
  await rollRecurringBills(supabase, profile.family_id);

  const [{ entradasCents, saidasCents, saldoCents, spentByGroup }, streak, goals, { data: bills }] =
    await Promise.all([
      getMonthSummary(supabase, profile.family_id),
      getLoggingStreak(supabase, profile.family_id),
      getGoals(supabase, profile.family_id),
      supabase
        .from("bills")
        .select("id, name, amount_cents, due_date, paid")
        .eq("family_id", profile.family_id)
        .eq("paid", false)
        .order("due_date")
        .limit(3),
    ]);

  const groups = await getBudgetGroups(supabase, profile.family_id, spentByGroup);
  const mainGoal = goals[0];
  const tip = tipOfTheDay();

  const GroupsSection = (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h4>Seus grupos</h4>
        <Link href="/orcamento" className="text-[13px] font-semibold text-accent-ink">
          ver tudo
        </Link>
      </div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
        {groups.map((g) => (
          <GroupRow key={g.id} group={g} />
        ))}
        {groups.length === 0 && (
          <Card className="text-[14px] text-ink-muted">Nenhum grupo de orçamento ainda.</Card>
        )}
      </div>
    </section>
  );

  const ProximasContasCard = (
    <Card>
      <div className="mb-1 flex items-center justify-between">
        <h5>Próximas contas</h5>
        <Link href="/contas" className="text-[13px] font-semibold text-accent-ink">
          ver tudo
        </Link>
      </div>
      <div className="divide-y divide-divider">
        {(bills ?? []).map((b) => (
          <BillRow key={b.id} bill={b} />
        ))}
        {(!bills || bills.length === 0) && (
          <p className="py-2 text-[14px] text-ink-muted">Nenhuma conta pendente. 🎉</p>
        )}
      </div>
    </Card>
  );

  const MetaCard = mainGoal ? (
    <GoalCard goal={mainGoal} />
  ) : (
    <Card className="flex flex-col gap-2">
      <h5>Meta principal</h5>
      <p className="text-[14px] text-ink-muted">Ainda não tem nenhuma meta. Que tal criar a primeira?</p>
      <Link href="/metas/nova" className="text-[14px] font-semibold text-accent-ink">
        + Criar meta
      </Link>
    </Card>
  );

  const DicaCard = (
    <Card tint="accent2">
      <h6 className="mb-1 text-accent2-800 dark:text-accent2-300">Dica do dia</h6>
      <p className="text-[14px] text-ink">{tip}</p>
    </Card>
  );

  return (
    <div>
      <PageHeader title="Início" name={profile.full_name} avatarColor={profile.avatar_color} />

      {/* Mobile layout */}
      <div className="flex flex-col gap-4 md:hidden">
        <Card tint="dark" className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG, no Image optimization needed */}
          <img
            src="/brand/fundos/canto-aneis-escuro.svg"
            alt=""
            className="pointer-events-none absolute -bottom-16 -right-16 w-[280px]"
          />
          <div className="relative">
            <p className="text-[13px] text-[#CFE0D3]">Saldo do mês</p>
            <h2 className="ecg-kpi mb-1 tabular-nums">{formatCents(saldoCents)}</h2>
            <p className="flex items-center gap-3 text-[13px]">
              <span className="flex items-center gap-1 tabular-nums">
                <ArrowUp size={14} strokeWidth={2.25} /> {formatCents(entradasCents)} entradas
              </span>
              <span className="flex items-center gap-1 tabular-nums text-[#e2836b]">
                <ArrowDown size={14} strokeWidth={2.25} /> {formatCents(saidasCents)} saídas
              </span>
            </p>
          </div>
        </Card>
        <StreakBanner streak={streak} />
        {GroupsSection}
        {ProximasContasCard}
        {MetaCard}
        {DicaCard}
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Card tint="dark" className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG, no Image optimization needed */}
            <img
              src="/brand/fundos/canto-aneis-escuro.svg"
              alt=""
              className="pointer-events-none absolute -bottom-16 -right-16 w-[280px]"
            />
            <div className="relative">
              <p className="text-[13px] text-[#CFE0D3]">Saldo do mês</p>
              <h2 className="ecg-kpi tabular-nums">{formatCents(saldoCents)}</h2>
            </div>
          </Card>
          <Card>
            <p className="text-[13px] text-ink-muted">Entradas</p>
            <h2 className="ecg-kpi tabular-nums text-positive">{formatCents(entradasCents)}</h2>
          </Card>
          <Card>
            <p className="text-[13px] text-ink-muted">Saídas</p>
            <h2 className="ecg-kpi tabular-nums text-negative">{formatCents(saidasCents)}</h2>
          </Card>
        </div>
        <div className="grid grid-cols-[1fr_360px] gap-6">
          {GroupsSection}
          <div className="flex flex-col gap-4">
            <StreakBanner streak={streak} />
            {ProximasContasCard}
            {MetaCard}
            {DicaCard}
          </div>
        </div>
      </div>
    </div>
  );
}
