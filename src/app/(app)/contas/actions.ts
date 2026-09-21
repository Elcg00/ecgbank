"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/session";
import { parseMoneyToCents } from "@/lib/format";

export async function createBill(formData: FormData) {
  const { supabase, profile } = await getSessionContext();

  const name = String(formData.get("name") || "").trim();
  const amountCents = parseMoneyToCents(formData.get("amount"));
  const dueDate = String(formData.get("due_date") || "");

  if (!name || amountCents <= 0 || !dueDate) {
    throw new Error("Preencha nome, valor e vencimento.");
  }

  await supabase.from("bills").insert({
    family_id: profile.family_id,
    name,
    amount_cents: amountCents,
    due_date: dueDate,
  });

  redirect("/contas");
}

export async function markBillPaid(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const billId = String(formData.get("bill_id"));
  const paid = String(formData.get("paid")) === "true";

  await supabase
    .from("bills")
    .update({ paid, paid_at: paid ? new Date().toISOString().slice(0, 10) : null })
    .eq("id", billId)
    .eq("family_id", profile.family_id);

  revalidatePath("/contas");
  revalidatePath("/");
}

export async function updateBill(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const billId = String(formData.get("bill_id"));
  const name = String(formData.get("name") || "").trim();
  const amountCents = parseMoneyToCents(formData.get("amount"));
  const dueDate = String(formData.get("due_date") || "");

  if (!name || amountCents <= 0 || !dueDate) {
    throw new Error("Preencha nome, valor e vencimento.");
  }

  await supabase
    .from("bills")
    .update({ name, amount_cents: amountCents, due_date: dueDate })
    .eq("id", billId)
    .eq("family_id", profile.family_id);

  redirect("/contas");
}

export async function deleteBill(formData: FormData) {
  const { supabase, profile } = await getSessionContext();
  const billId = String(formData.get("bill_id"));

  await supabase.from("bills").delete().eq("id", billId).eq("family_id", profile.family_id);

  redirect("/contas");
}
