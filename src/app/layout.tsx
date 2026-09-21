import type { Metadata, Viewport } from "next";
import { Caprasimo, Figtree } from "next/font/google";
import "./globals.css";

const caprasimo = Caprasimo({
  variable: "--font-caprasimo",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ECG Bank",
  description: "Organização financeira para a família, sem julgamento.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f4ed" },
    { media: "(prefers-color-scheme: dark)", color: "#2e2b25" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Reads the preference cookies and applies them to <html> before first
// paint, so light/dark/accent/heading never flash the default and switch.
// Runs as a plain inline script (not a per-request server read) so every
// route — including the static auth pages — keeps its static optimization.
const APPLY_PREFS_SCRIPT = `(function(){try{function get(n){var m=document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):null;}var t=get('theme_preference');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);var a=get('accent_theme');if(a&&a!=='verde')document.documentElement.setAttribute('data-accent',a);var h=get('heading_style');if(h==='neutro')document.documentElement.setAttribute('data-heading',h);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${caprasimo.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: APPLY_PREFS_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
