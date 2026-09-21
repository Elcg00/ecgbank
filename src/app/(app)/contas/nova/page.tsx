import { BackHeader } from "@/components/app/BackHeader";
import { BillForm } from "./BillForm";

export default function NovaContaPage() {
  return (
    <div>
      <BackHeader href="/contas" label="Contas a pagar" />
      <h1 className="mb-5">Nova conta</h1>
      <BillForm />
    </div>
  );
}
