import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionContext } from "@/lib/session";
import { getOverdueBillsCount } from "@/lib/queries/bills";
import { Sidebar } from "@/components/app/Sidebar";
import { BottomNav } from "@/components/app/BottomNav";
import { ToastListener } from "@/components/app/ToastListener";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { supabase, profile } = await getSessionContext();

  if (!profile.onboarding_completed_at) {
    redirect("/onboarding/1");
  }

  const [{ data: family }, overdueBillsCount] = await Promise.all([
    supabase.from("families").select("name").eq("id", profile.family_id).single(),
    getOverdueBillsCount(supabase, profile.family_id),
  ]);

  return (
    <div className="min-h-dvh md:pl-[248px]">
      <ToastListener />
      <Sidebar
        familyName={family?.name ?? "Sua família"}
        memberName={profile.full_name || "Você"}
        avatarColor={profile.avatar_color}
        overdueBillsCount={overdueBillsCount}
      />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-6 md:px-10 md:pb-10 md:pt-10">
        {children}
      </main>
      <BottomNav overdueBillsCount={overdueBillsCount} />
    </div>
  );
}
