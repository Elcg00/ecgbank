import type { ReactNode } from "react";
import { ToastListener } from "@/components/app/ToastListener";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-dvh items-center justify-center bg-accent-700 bg-cover bg-center px-5 py-10"
      style={{ backgroundImage: "url(/brand/fundos/fundo-hero-escuro.svg)" }}
    >
      <ToastListener />
      <div className="w-full max-w-[420px]">
        <div
          className="rounded-card bg-white p-7 text-ink shadow-lg"
          style={
            {
              // The card is always the brand's white surface, regardless of
              // the site-wide tema claro/escuro toggle — pin every token its
              // contents (headings, labels, Field/Select shells, links) read
              // to their light values so text stays legible on this white
              // card even when the rest of the app is rendering dark.
              "--color-ink": "#1b241e",
              "--color-ink-muted": "#566459",
              "--color-divider": "#dce5dd",
              "--color-app": "#f5f8f4",
              "--color-surface": "#ffffff",
              "--color-surface-2": "#e9eee8",
              "--color-accent-ink": "#173d2a",
            } as React.CSSProperties
          }
        >
          <div className="mb-5 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG, no Image optimization needed */}
            <img src="/brand/logo/ecg-bank-simbolo.svg" alt="" className="h-12 w-12" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
