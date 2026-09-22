import { BackHeader } from "@/components/app/BackHeader";
import { GoalForm } from "./GoalForm";

export default async function NovaMetaPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name } = await searchParams;

  return (
    <div>
      <BackHeader href="/metas" label="Metas" />
      <h1 className="mb-5">Nova meta</h1>
      <GoalForm defaultName={name} />
    </div>
  );
}
