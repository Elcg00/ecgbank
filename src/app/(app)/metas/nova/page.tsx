import { BackHeader } from "@/components/app/BackHeader";
import { GoalForm } from "./GoalForm";

export default function NovaMetaPage() {
  return (
    <div>
      <BackHeader href="/metas" label="Metas" />
      <h1 className="mb-5">Nova meta</h1>
      <GoalForm />
    </div>
  );
}
