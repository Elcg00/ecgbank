import { notFound } from "next/navigation";
import { BackHeader } from "@/components/app/BackHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { getSessionContext } from "@/lib/session";
import { centsToInputValue } from "@/lib/format";
import { updateBill, deleteBill } from "../actions";

export default async function EditBillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();

  const { data: bill } = await supabase
    .from("bills")
    .select("id, name, amount_cents, due_date")
    .eq("id", id)
    .eq("family_id", profile.family_id)
    .maybeSingle();

  if (!bill) notFound();

  return (
    <div>
      <BackHeader href="/contas" label="Contas a pagar" />
      <h1 className="mb-5">Editar conta</h1>
      <form action={updateBill} className="flex flex-col gap-4">
        <input type="hidden" name="bill_id" value={bill.id} />
        <Field label="Nome da conta" name="name" defaultValue={bill.name} required />
        <Field
          label="Valor"
          name="amount"
          inputMode="decimal"
          prefix="R$"
          defaultValue={centsToInputValue(bill.amount_cents)}
          required
        />
        <Field label="Vencimento" name="due_date" type="date" defaultValue={bill.due_date} required />
        <Button type="submit">Salvar alterações</Button>
      </form>

      <ConfirmForm
        action={deleteBill}
        confirmMessage={`Excluir a conta "${bill.name}"?`}
        className="mt-4"
      >
        <input type="hidden" name="bill_id" value={bill.id} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir conta
        </Button>
      </ConfirmForm>
    </div>
  );
}
