const PALETTE = [
  "bg-accent-200 text-accent-800",
  "bg-accent2-200 text-accent2-800",
  "bg-[#fbe6e0] text-negative",
  "bg-[#fbedd2] text-warning",
];

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function contrastText(hex: string): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#201e1d" : "#ffffff";
}

export function Monogram({
  label,
  size = "md",
  color,
}: {
  label: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}) {
  const letter = label.trim().charAt(0).toUpperCase() || "?";
  const palette = PALETTE[hash(label) % PALETTE.length];
  const dims = size === "lg" ? "h-12 w-12 text-lg" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${dims} ${color ? "" : palette}`}
      style={color ? { backgroundColor: color, color: contrastText(color) } : undefined}
      aria-hidden
    >
      {letter}
    </span>
  );
}
