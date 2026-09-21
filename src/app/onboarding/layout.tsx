import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionContext } from "@/lib/session";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  const { profile } = await getSessionContext();

  if (profile.onboarding_completed_at) {
    redirect("/");
  }

  return (
    <div className="flex min-h-dvh justify-center bg-app px-5 py-8">
      <div className="w-full max-w-[440px]">{children}</div>
    </div>
  );
}
