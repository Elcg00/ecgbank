import { BackHeader } from "@/components/app/BackHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createCard } from "../actions";

export default function NovoCartaoPage() {
  return (
    <div>
      <BackHeader href="/cartao" label="Cartão de crédito" />
      <h1 className="mb-5">Novo cartão</h1>
      <form action={createCard} className="flex flex-col gap-4">
        <Field label="Nome do cartão" name="name" placeholder="Cartão" defaultValue="Cartão" />
        <Field label="Limite" name="limit" inputMode="decimal" prefix="R$" placeholder="3.000" />
        <Field label="Dia de fechamento" name="closing_day" inputMode="numeric" placeholder="15" defaultValue="15" />
        <Field label="Dia de vencimento" name="due_day" inputMode="numeric" placeholder="5" defaultValue="5" />
        <Button type="submit">Cadastrar cartão</Button>
      </form>
    </div>
  );
}
