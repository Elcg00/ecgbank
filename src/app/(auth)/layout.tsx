import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-app px-5 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <span className="font-heading text-2xl text-accent-ink">ECG BANK</span>
        </div>
        <div className="rounded-card bg-surface p-7 shadow-md">{children}</div>
      </div>
    </div>
  );
}
