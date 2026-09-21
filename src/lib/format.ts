export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(`${date}T00:00:00`) : date;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function daysUntil(date: string): number {
  const target = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function billDueLabel(dueDate: string, paid: boolean): {
  label: string;
  status: "paga" | "atrasada" | "a_vencer";
} {
  if (paid) return { label: `Paga em ${formatDate(dueDate)}`, status: "paga" };
  const diff = daysUntil(dueDate);
  if (diff < 0) return { label: `Venceu ${formatDate(dueDate)}`, status: "atrasada" };
  if (diff === 0) return { label: "Vence hoje", status: "a_vencer" };
  if (diff <= 6) return { label: `Vence em ${diff} dia${diff > 1 ? "s" : ""}`, status: "a_vencer" };
  return { label: `Vence ${formatDate(dueDate)}`, status: "a_vencer" };
}

export function greeting(): string {
  const hour = new Date().getUTCHours() - 3; // approx. America/Sao_Paulo
  const h = ((hour % 24) + 24) % 24;
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function monthsUntil(deadline: string | null): number | null {
  if (!deadline) return null;
  const target = new Date(`${deadline}T00:00:00`);
  const today = new Date();
  const months =
    (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
  return Math.max(0, months);
}

export function nextDayOfMonthLabel(day: number): string {
  const today = new Date();
  let d = new Date(today.getFullYear(), today.getMonth(), day);
  if (d < today) d = new Date(today.getFullYear(), today.getMonth() + 1, day);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function monogram(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}
