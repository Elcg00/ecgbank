import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionContext } from "@/lib/session";
import { OnboardingHeader } from "../OnboardingHeader";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { SelectableChip } from "@/components/ui/SelectableChip";
import { SelectableCard } from "@/components/ui/SelectableCard";
import {
  saveIncome,
  saveFixedCosts,
  saveHasDebts,
  saveFirstGoal,
  saveOrgModel,
  finishOnboarding,
} from "../actions";

const FIXED_COSTS = ["Aluguel/Financiamento", "Internet", "Energia", "Água", "Escola/Faculdade", "Assinaturas"];

const FIRST_GOALS = [
  { value: "reserva", title: "Criar reserva de emergência" },
  { value: "divida", title: "Quitar uma dívida" },
  { value: "especial", title: "Guardar para algo especial" },
  { value: "gastos", title: "Organizar os gastos do dia a dia" },
];

const ORG_MODELS = [
  { value: "zero", title: "Do zero", description: "Vamos descobrir juntos o melhor jeito para vocês." },
  { value: "50-30-20", title: "50/30/20", description: "50% essenciais, 30% desejos, 20% metas e dívidas." },
  { value: "envelopes", title: "Envelopes", description: "Um limite fixo por categoria de gasto." },
  { value: "dividas", title: "Quitar dívidas primeiro", description: "Foco total em zerar o que vocês devem." },
];

export default async function OnboardingStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: stepParam } = await params;
  const step = Number(stepParam);
  if (!Number.isInteger(step) || step < 1 || step > 7) notFound();

  const { supabase, profile } = await getSessionContext();
  const { data: answers } = await supabase
    .from("onboarding_answers")
    .select("*")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (step === 1) {
    return (
      <div>
        <OnboardingHeader step={1} />
        <div className="mb-6 aspect-[16/10] w-full rounded-2xl bg-[repeating-linear-gradient(135deg,var(--color-accent-200),var(--color-accent-200)_10px,var(--color-accent-100)_10px,var(--color-accent-100)_20px)]" />
        <h1 className="mb-2">Bem-vindo(a) ao ECG Bank</h1>
        <p className="mb-8 text-ink-muted">
          Vamos organizar as finanças de vocês com calma, um passo de cada vez, sem julgamento.
        </p>
        <Link href="/onboarding/2">
          <Button className="w-full">Vamos começar</Button>
        </Link>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <OnboardingHeader step={2} />
        <h1 className="mb-2">Quanto você ganha por mês?</h1>
        <p className="mb-6 text-ink-muted">Pode ser uma estimativa, dá para ajustar depois.</p>
        <form action={saveIncome} className="flex flex-col gap-6">
          <Field
            label="Renda mensal"
            name="income"
            inputMode="numeric"
            prefix="R$"
            defaultValue={answers ? String(answers.monthly_income_cents / 100) : "4.500"}
          />
          <Button type="submit" className="w-full">
            Continuar
          </Button>
        </form>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div>
        <OnboardingHeader step={3} />
        <h1 className="mb-2">Quais contas fixas vocês têm?</h1>
        <p className="mb-6 text-ink-muted">Selecione todas que se aplicam.</p>
        <form action={saveFixedCosts} className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {FIXED_COSTS.map((cost) => (
              <SelectableChip
                key={cost}
                name="fixed_cost"
                value={cost}
                label={cost}
                defaultChecked={answers?.fixed_cost_chips?.includes(cost)}
              />
            ))}
          </div>
          <Button type="submit" className="w-full">
            Continuar
          </Button>
        </form>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div>
        <OnboardingHeader step={4} />
        <h1 className="mb-2">Você tem dívidas hoje?</h1>
        <p className="mb-6 text-ink-muted">Tudo bem se sim — o primeiro passo é saber onde vocês estão.</p>
        <form action={saveHasDebts} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3">
            <SelectableCard
              name="has_debts"
              value="sim"
              title="Sim, tenho"
              defaultChecked={answers?.has_debts === true}
            />
            <SelectableCard
              name="has_debts"
              value="nao"
              title="Ainda não"
              defaultChecked={answers?.has_debts === false}
            />
          </div>
          <Button type="submit" className="w-full">
            Continuar
          </Button>
        </form>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div>
        <OnboardingHeader step={5} />
        <h1 className="mb-2">Qual seu primeiro objetivo?</h1>
        <p className="mb-6 text-ink-muted">Vamos priorizar isso primeiro.</p>
        <form action={saveFirstGoal} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {FIRST_GOALS.map((goal) => (
              <SelectableCard
                key={goal.value}
                name="first_goal"
                value={goal.value}
                title={goal.title}
                defaultChecked={answers?.first_goal === goal.value}
              />
            ))}
          </div>
          <Button type="submit" className="w-full">
            Continuar
          </Button>
        </form>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div>
        <OnboardingHeader step={6} />
        <h1 className="mb-2">Como vocês querem se organizar?</h1>
        <p className="mb-6 text-ink-muted">Você pode mudar isso depois, sem problema.</p>
        <form action={saveOrgModel} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {ORG_MODELS.map((model) => (
              <SelectableCard
                key={model.value}
                name="org_model"
                value={model.value}
                title={model.title}
                description={model.description}
                defaultChecked={answers?.org_model === model.value}
              />
            ))}
          </div>
          <Button type="submit" className="w-full">
            Continuar
          </Button>
        </form>
      </div>
    );
  }

  if (profile.role !== "admin") {
    // Only whoever started the family sends the invite; a joined partner just finishes.
    await finishOnboarding(new FormData());
  }

  return (
    <div>
      <OnboardingHeader step={7} />
      <h1 className="mb-2">Convide seu parceiro(a)</h1>
      <p className="mb-6 text-ink-muted">
        Assim vocês dois acompanham e lançam gastos juntos. Pode convidar depois também.
      </p>
      <form action={finishOnboarding} className="flex flex-col gap-6">
        <Field label="E-mail do parceiro(a)" name="partner_email" type="email" placeholder="nome@email.com" />
        <Button type="submit" className="w-full">
          Convidar e começar
        </Button>
      </form>
      <form action={finishOnboarding} className="mt-3 text-center">
        <button type="submit" className="text-[14px] font-semibold text-ink-muted hover:underline">
          Pular por enquanto
        </button>
      </form>
    </div>
  );
}
