"use server";

import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/session";

export async function updateName(
  _prev: { error?: string; saved?: boolean } | undefined,
  formData: FormData,
) {
  const { supabase, profile } = await getSessionContext();
  const fullName = String(formData.get("full_name") || "").trim();

  if (!fullName) {
    return { error: "O nome não pode ficar vazio." };
  }

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id);
  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  revalidatePath("/", "layout");
  return { saved: true };
}
