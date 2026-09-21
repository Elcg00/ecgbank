import Link from "next/link";
import { greeting } from "@/lib/format";
import { Monogram } from "@/components/ui/Monogram";

export function PageHeader({
  title,
  name,
  avatarColor,
}: {
  title: string;
  name: string;
  avatarColor?: string;
}) {
  return (
    <div className="mb-5 flex items-start justify-between md:mb-8">
      <div>
        <p className="text-[14px] text-ink-muted">
          {greeting()}, {name.split(" ")[0]} 👋
        </p>
        <h1>{title}</h1>
      </div>
      <Link href="/configuracoes" className="md:hidden" aria-label="Configurações">
        <Monogram label={name} size="lg" color={avatarColor} />
      </Link>
    </div>
  );
}
