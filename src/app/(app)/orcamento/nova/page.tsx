import { BackHeader } from "@/components/app/BackHeader";
import { GroupForm } from "./GroupForm";

export default function NovoGrupoPage() {
  return (
    <div>
      <BackHeader href="/orcamento" label="Orçamento" />
      <h1 className="mb-5">Novo grupo</h1>
      <GroupForm />
    </div>
  );
}
