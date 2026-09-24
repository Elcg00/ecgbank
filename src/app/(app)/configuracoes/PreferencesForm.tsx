"use client";

import { useActionState } from "react";
import { updatePreferences } from "./actions";
import { Button } from "@/components/ui/Button";
import type { ThemePreference } from "@/lib/preferences-shared";

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "Automático" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
];

export function PreferencesForm({ defaultTheme }: { defaultTheme: ThemePreference }) {
  const [state, formAction, pending] = useActionState(updatePreferences, undefined);

  function preview(value: string) {
    document.documentElement.setAttribute("data-theme", value === "system" ? "" : value);
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
                onChange={() => preview(t.value)}
                className="peer sr-only"
              />
              <span className="inline-flex items-center rounded-full border border-divider bg-app px-4 py-2 text-[14px] font-semibold text-ink transition-colors peer-checked:border-accent-700 peer-checked:bg-accent-100 peer-checked:text-accent-800 dark:peer-checked:bg-accent-900/40 dark:peer-checked:text-accent-300">
                {t.label}
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
