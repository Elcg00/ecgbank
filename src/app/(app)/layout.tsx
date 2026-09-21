import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionContext } from "@/lib/session";
import { Sidebar } from "@/components/app/Sidebar";
import { BottomNav } from "@/components/app/BottomNav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { supabase, profile } = await getSessionContext();

  if (!profile.onboarding_completed_at) {
    redirect("/onboarding/1");
  }

  const { data: family } = await supabase
    .from("families")
    .select("name")
    .eq("id", profile.family_id)
    .single();

  return (
    <div className="min-h-dvh md:pl-[248px]">
      <Sidebar familyName={family?.name ?? "Sua família"} memberName={profile.full_name || "Você"} />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-6 md:px-10 md:pb-10 md:pt-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
