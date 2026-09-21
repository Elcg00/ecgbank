import { BackHeader } from "@/components/app/BackHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { createGroup } from "../actions";

export default function NovoGrupoPage() {
  return (
    <div>
      <BackHeader href="/orcamento" label="Orçamento" />
      <h1 className="mb-5">Novo grupo</h1>
      <form action={createGroup} className="flex flex-col gap-4">
        <Field label="Nome do grupo" name="name" required placeholder="Saúde" />
        <Field label="Limite mensal (opcional)" name="limit" inputMode="decimal" prefix="R$" placeholder="0" />
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink-muted">Tipo</p>
          <div className="grid grid-cols-2 gap-3">
            <SelectableCard name="kind" value="spending" title="Gasto" defaultChecked />
            <SelectableCard name="kind" value="saving" title="Guardar" />
          </div>
        </div>
        <Button type="submit">Criar grupo</Button>
      </form>
    </div>
  );
}
