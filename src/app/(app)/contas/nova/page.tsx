import { BackHeader } from "@/components/app/BackHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createBill } from "../actions";

export default function NovaContaPage() {
  return (
    <div>
      <BackHeader href="/contas" label="Contas a pagar" />
      <h1 className="mb-5">Nova conta</h1>
      <form action={createBill} className="flex flex-col gap-4">
        <Field label="Nome da conta" name="name" required placeholder="Aluguel" />
        <Field label="Valor" name="amount" inputMode="numeric" prefix="R$" required placeholder="1.200" />
        <Field label="Vencimento" name="due_date" type="date" required />
        <Button type="submit">Adicionar conta</Button>
      </form>
    </div>
  );
}
