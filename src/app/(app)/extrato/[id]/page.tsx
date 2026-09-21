import { notFound } from "next/navigation";
import { BackHeader } from "@/components/app/BackHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { SelectableChip } from "@/components/ui/SelectableChip";
import { getSessionContext } from "@/lib/session";
import { centsToInputValue } from "@/lib/format";
import { updateTransaction, deleteTransaction } from "../actions";

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSessionContext();

  const [{ data: transaction }, { data: groups }] = await Promise.all([
    supabase
      .from("transactions")
      .select("id, type, amount_cents, budget_group_id, occurred_at")
      .eq("id", id)
      .eq("family_id", profile.family_id)
      .maybeSingle(),
    supabase.from("budget_groups").select("id, name").eq("family_id", profile.family_id).order("sort_order"),
  ]);

  if (!transaction) notFound();

  return (
    <div>
      <BackHeader href="/extrato" label="Extrato" />
      <h1 className="mb-5">Editar lançamento</h1>
      <form action={updateTransaction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={transaction.id} />
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink-muted">Tipo</p>
          <div className="flex gap-2">
            <SelectableChip
              name="type"
              value="entrada"
              label="Entrada"
              type="radio"
              defaultChecked={transaction.type === "entrada"}
            />
            <SelectableChip
              name="type"
              value="saida"
              label="Saída"
              type="radio"
              defaultChecked={transaction.type === "saida"}
            />
          </div>
        </div>
        <Field
          label="Valor"
          name="amount"
          inputMode="decimal"
          prefix="R$"
          defaultValue={centsToInputValue(transaction.amount_cents)}
          required
        />
        {(groups ?? []).length > 0 && (
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink-muted">Categoria</p>
            <div className="flex flex-wrap gap-2">
              {(groups ?? []).map((g) => (
                <SelectableChip
                  key={g.id}
                  name="budget_group_id"
                  value={g.id}
                  label={g.name}
                  type="radio"
                  defaultChecked={transaction.budget_group_id === g.id}
                />
              ))}
            </div>
          </div>
        )}
        <Field label="Data" name="occurred_at" type="date" defaultValue={transaction.occurred_at} />
        <Button type="submit">Salvar alterações</Button>
      </form>

      <ConfirmForm
        action={deleteTransaction}
        confirmMessage="Excluir este lançamento? Essa ação não pode ser desfeita."
        className="mt-4"
      >
        <input type="hidden" name="id" value={transaction.id} />
        <Button type="submit" variant="secondary" className="w-full text-negative">
          Excluir lançamento
        </Button>
      </ConfirmForm>
    </div>
  );
}
