export function CountBadge({ count, className }: { count: number; className?: string }) {
  if (!count) return null;

  return (
    <span
      className={`flex items-center justify-center rounded-full bg-negative font-bold text-white ${className ?? ""}`}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
