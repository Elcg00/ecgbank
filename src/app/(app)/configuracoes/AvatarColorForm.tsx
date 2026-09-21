"use client";

import { useActionState, useState } from "react";
import { updateAvatarColor } from "./actions";
import { Button } from "@/components/ui/Button";
import { Monogram } from "@/components/ui/Monogram";
import { AVATAR_COLORS } from "@/lib/avatar-colors";

export function AvatarColorForm({ name, defaultColor }: { name: string; defaultColor: string }) {
  const [state, formAction, pending] = useActionState(updateAvatarColor, undefined);
  const [color, setColor] = useState(defaultColor);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="avatar_color" value={color} />
      <div className="flex items-center gap-3">
        <Monogram label={name} size="lg" color={color} />
        <div className="flex flex-wrap gap-2">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Cor ${c}`}
              className="flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-surface"
              style={{
                backgroundColor: c,
                boxShadow: color === c ? "0 0 0 2px var(--color-ink)" : undefined,
              }}
            />
          ))}
        </div>
      </div>
      {state?.error && <p className="text-[13px] text-negative">{state.error}</p>}
      {state?.saved && <p className="text-[13px] text-positive">Cor atualizada!</p>}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Salvando…" : "Salvar cor"}
      </Button>
    </form>
  );
}
