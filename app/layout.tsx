import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import "./globals.css";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LIKEN",
  description: "Plataforma híbrida para inversión sustentable, trazabilidad y operación blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <AppProviders>
          <div className="fixed right-4 top-4 z-50">
            <ThemeToggle />
          </div>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
