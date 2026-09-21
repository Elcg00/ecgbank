import { BackHeader } from "@/components/app/BackHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createGoal } from "../actions";

export default function NovaMetaPage() {
  return (
    <div>
      <BackHeader href="/metas" label="Metas" />
      <h1 className="mb-5">Nova meta</h1>
      <form action={createGoal} className="flex flex-col gap-4">
        <Field label="Nome da meta" name="name" required placeholder="Reserva de emergência" />
        <Field label="Valor alvo" name="target" inputMode="numeric" prefix="R$" required placeholder="3.000" />
        <Field label="Guardar por mês" name="monthly_target" inputMode="numeric" prefix="R$" placeholder="225" />
        <Field label="Prazo" name="deadline" type="date" />
        <label className="flex items-center gap-2 text-[14px] font-semibold text-ink">
          <input type="checkbox" name="shared" defaultChecked className="h-4 w-4 accent-accent-700" />
          Meta compartilhada com a família
        </label>
        <Button type="submit">Criar meta</Button>
      </form>
    </div>
  );
}
