"use client";

import { useActionState } from "react";
import { updatePreferences } from "./actions";
import { Button } from "@/components/ui/Button";
import {
  ACCENT_LABELS,
  type AccentTheme,
  type HeadingStyle,
  type ThemePreference,
} from "@/lib/preferences-shared";

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "Automático" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
];

const ACCENTS: { value: AccentTheme; hex: string }[] = [
  { value: "verde", hex: "#2d5535" },
  { value: "azul", hex: "#2c4d6c" },
  { value: "roxo", hex: "#52335f" },
  { value: "terracota", hex: "#723a21" },
  { value: "grafite", hex: "#3a3f46" },
];

const HEADINGS: { value: HeadingStyle; label: string }[] = [
  { value: "divertido", label: "Divertido" },
  { value: "neutro", label: "Neutro" },
];

export function PreferencesForm({
  defaultTheme,
  defaultAccent,
  defaultHeading,
}: {
  defaultTheme: ThemePreference;
  defaultAccent: AccentTheme;
  defaultHeading: HeadingStyle;
}) {
  const [state, formAction, pending] = useActionState(updatePreferences, undefined);

  function preview(attr: string, value: string) {
    document.documentElement.setAttribute(attr, value);
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-muted">Tema</p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <label key={t.value} className="cursor-pointer">
              <input
                type="radio"
                name="theme_preference"
                value={t.value}
                defaultChecked={defaultTheme === t.value}
                onChange={() => preview("data-theme", t.value === "system" ? "" : t.value)}
                className="peer sr-only"
              />
              <span className="inline-flex items-center rounded-full border border-divider bg-app px-4 py-2 text-[14px] font-semibold text-ink transition-colors peer-checked:border-accent-700 peer-checked:bg-accent-100 peer-checked:text-accent-800 dark:peer-checked:bg-accent-900/40 dark:peer-checked:text-accent-300">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-muted">Cor de destaque</p>
        <div className="flex flex-wrap gap-3">
          {ACCENTS.map((a) => (
            <label key={a.value} className="cursor-pointer">
              <input
                type="radio"
                name="accent_theme"
                value={a.value}
                defaultChecked={defaultAccent === a.value}
                onChange={() => preview("data-accent", a.value === "verde" ? "" : a.value)}
                className="peer sr-only"
              />
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full ring-offset-2 ring-offset-surface peer-checked:ring-2 peer-checked:ring-ink"
                style={{ backgroundColor: a.hex }}
                title={ACCENT_LABELS[a.value]}
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-muted">Estilo do título</p>
        <div className="flex flex-wrap gap-2">
          {HEADINGS.map((h) => (
            <label key={h.value} className="cursor-pointer">
              <input
                type="radio"
                name="heading_style"
                value={h.value}
                defaultChecked={defaultHeading === h.value}
                onChange={() => preview("data-heading", h.value === "divertido" ? "" : h.value)}
                className="peer sr-only"
              />
              <span className="inline-flex items-center rounded-full border border-divider bg-app px-4 py-2 text-[14px] font-semibold text-ink transition-colors peer-checked:border-accent-700 peer-checked:bg-accent-100 peer-checked:text-accent-800 dark:peer-checked:bg-accent-900/40 dark:peer-checked:text-accent-300">
                {h.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {state?.error && <p className="text-[13px] text-negative">{state.error}</p>}
      {state?.saved && <p className="text-[13px] text-positive">Preferências salvas!</p>}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Salvando…" : "Salvar preferências"}
      </Button>
    </form>
  );
}
