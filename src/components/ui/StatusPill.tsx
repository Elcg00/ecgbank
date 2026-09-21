export type Status = "positivo" | "atencao" | "negativo" | "acento";

const styles: Record<Status, string> = {
  positivo: "bg-positive-bg text-positive",
  atencao: "bg-warning-bg text-warning",
  negativo: "bg-negative-bg text-negative",
  acento: "bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300",
};

export function StatusPill({ status, children }: { status: Status; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${styles[status]}`}
    >
      {children}
    </span>
  );
}
