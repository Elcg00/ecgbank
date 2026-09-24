import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ECG Bank",
  description: "Organização financeira para a família, sem julgamento.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0f2a1c" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Reads the theme cookie and applies it to <html> before first paint, so
// light/dark never flashes the default and switches. Runs as a plain inline
// script (not a per-request server read) so every route — including the
// static auth pages — keeps its static optimization.
const APPLY_PREFS_SCRIPT = `(function(){try{function get(n){var m=document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):null;}var t=get('theme_preference');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: APPLY_PREFS_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
