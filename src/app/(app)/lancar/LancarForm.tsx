"use client";

import { useMemo, useState } from "react";
import { Delete } from "lucide-react";
import { createTransaction } from "./actions";
import { Monogram } from "@/components/ui/Monogram";
import { Button } from "@/components/ui/Button";

type Category = { id: string; name: string };
type Member = { id: string; name: string };

const PAYMENT_METHODS = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
];

const INCOME_SOURCES = [
  { value: "salario", label: "Salário" },
  { value: "extra", label: "Renda extra" },
  { value: "reembolso", label: "Reembolso" },
  { value: "outro", label: "Outro" },
];

const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

function formatCentsDisplay(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function LancarForm({ categories, members }: { categories: Category[]; members: Member[] }) {
  const [type, setType] = useState<"entrada" | "saida">("saida");
  const [cents, setCents] = useState(0);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [incomeSource, setIncomeSource] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [installments, setInstallments] = useState(1);
  const [memberId, setMemberId] = useState<string>(members[0]?.id ?? "");
  const [recurring, setRecurring] = useState(false);
  const [pending, setPending] = useState(false);

  const installmentOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  function press(key: string) {
    if (key === "") return;
    if (key === "back") {
      setCents((c) => Math.floor(c / 10));
      return;
    }
    setCents((c) => (c >= 99_999_999 ? c : c * 10 + Number(key)));
  }

  return (
    <form
      action={createTransaction}
      onSubmit={() => setPending(true)}
      className="flex flex-col gap-6"
    >
      <input type="hidden" name="amount_cents" value={cents} />
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="budget_group_id" value={categoryId ?? ""} />
      <input type="hidden" name="income_source" value={incomeSource ?? ""} />
      <input type="hidden" name="payment_method" value={paymentMethod ?? ""} />
      <input type="hidden" name="installments" value={installments} />
      <input type="hidden" name="member_id" value={memberId} />

      <div className="inline-flex self-start rounded-full bg-surface-2 p-1">
        <button
          type="button"
          onClick={() => setType("entrada")}
          className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-colors ${
            type === "entrada" ? "bg-positive text-white" : "text-ink-muted"
          }`}
        >
          Entrada
        </button>
        <button
          type="button"
          onClick={() => setType("saida")}
          className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-colors ${
            type === "saida" ? "bg-negative text-white" : "text-ink-muted"
          }`}
        >
          Saída
        </button>
      </div>

      <p className="text-center font-heading text-4xl text-ink">{formatCentsDisplay(cents)}</p>

      <div className="grid grid-cols-3 gap-2.5">
        {KEYPAD.map((key, i) =>
          key === "" ? (
            <span key={`blank-${i}`} />
          ) : (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              className="flex h-14 items-center justify-center rounded-2xl bg-surface text-xl font-semibold text-ink shadow-sm active:bg-surface-2"
              aria-label={key === "back" ? "Apagar" : key}
            >
              {key === "back" ? <Delete size={20} strokeWidth={2.5} /> : key}
            </button>
          ),
        )}
      </div>

      {type === "saida" && categories.length > 0 && (
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink-muted">Categoria</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(c.id)}
                className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl p-1 ${
                  categoryId === c.id ? "ring-2 ring-accent-700" : ""
                }`}
              >
                <Monogram label={c.name} size="lg" />
                <span className="text-[12px] text-ink-muted">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {type === "entrada" && (
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink-muted">Origem</p>
          <div className="flex flex-wrap gap-2">
            {INCOME_SOURCES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setIncomeSource(s.value)}
                className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
                  incomeSource === s.value
                    ? "border-accent-700 bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300"
                    : "border-divider text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-muted">Forma de pagamento</p>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setPaymentMethod(m.value)}
              className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
                paymentMethod === m.value
                  ? "border-accent-700 bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300"
                  : "border-divider text-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {paymentMethod === "credito" && (
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink-muted">Parcelas</p>
          <div className="flex flex-wrap gap-2">
            {installmentOptions.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setInstallments(n)}
                className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
                  installments === n
                    ? "border-accent-700 bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300"
                    : "border-divider text-ink"
                }`}
              >
                {n === 1 ? "À vista" : `${n}x`}
              </button>
            ))}
          </div>
        </div>
      )}

      {members.length > 1 && (
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink-muted">Quem lançou</p>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMemberId(m.id)}
                className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
                  memberId === m.id
                    ? "border-accent-700 bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300"
                    : "border-divider text-ink"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3">
        <span className="font-semibold text-ink">Conta recorrente</span>
        <span className="relative inline-flex h-6 w-11 items-center">
          <input
            type="checkbox"
            name="recurring"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="peer sr-only"
          />
          <span className="absolute inset-0 rounded-full bg-surface-2 transition-colors peer-checked:bg-accent-700" />
          <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
        </span>
      </label>

      <Button type="submit" disabled={cents <= 0 || pending} className="w-full">
        {pending ? "Salvando…" : "Salvar lançamento"}
      </Button>
    </form>
  );
}
