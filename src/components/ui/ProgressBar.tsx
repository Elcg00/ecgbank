export function ProgressBar({
  pct,
  color = "accent",
  className = "",
}: {
  pct: number;
  color?: "accent" | "positive" | "warning" | "negative";
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  const fill =
    color === "positive"
      ? "bg-positive"
      : color === "warning"
        ? "bg-warning"
        : color === "negative"
          ? "bg-negative"
          : "bg-accent-700";

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <div
        className={`h-full rounded-full ${fill} transition-[width] duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
