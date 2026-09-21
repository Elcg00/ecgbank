import { BackHeader } from "@/components/app/BackHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createDebt } from "../actions";

export default function NovaDividaPage() {
  return (
    <div>
      <BackHeader href="/dividas" label="Dívidas" />
      <h1 className="mb-5">Nova dívida</h1>
      <form action={createDebt} className="flex flex-col gap-4">
        <Field label="Nome da dívida" name="name" required placeholder="Cartão antigo" />
        <Field label="Valor restante" name="remaining" inputMode="numeric" prefix="R$" required placeholder="1.800" />
        <Field label="Juros ao mês (%)" name="interest_rate" inputMode="decimal" placeholder="12,5" />
        <Field label="Número de parcelas" name="installment_count" inputMode="numeric" placeholder="6" />
        <Field
          label="Valor da parcela"
          name="installment_amount"
          inputMode="numeric"
          prefix="R$"
          placeholder="346"
        />
        <Button type="submit">Adicionar dívida</Button>
      </form>
    </div>
  );
}
