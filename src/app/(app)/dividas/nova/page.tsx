import { BackHeader } from "@/components/app/BackHeader";
import { DebtForm } from "./DebtForm";

export default function NovaDividaPage() {
  return (
    <div>
      <BackHeader href="/dividas" label="Dívidas" />
      <h1 className="mb-5">Nova dívida</h1>
      <DebtForm />
    </div>
  );
}
