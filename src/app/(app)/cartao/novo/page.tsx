import { BackHeader } from "@/components/app/BackHeader";
import { CardForm } from "./CardForm";

export default function NovoCartaoPage() {
  return (
    <div>
      <BackHeader href="/cartao" label="Cartão de crédito" />
      <h1 className="mb-5">Novo cartão</h1>
      <CardForm />
    </div>
  );
}
