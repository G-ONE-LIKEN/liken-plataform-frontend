import type { ReactNode } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/**
 * Identidad visual compartida de las pantallas de auth (register / login /
 * verify-email / complete-profile): atmosfera de energia de fondo y panel con
 * barra superior degradada, halo y cabecera de marca.
 */

/** Fondo de pagina: halos esmeralda + ambar y grilla enmascarada. */
export function AuthBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 12% 8%, oklch(0.72 0.16 165 / 0.16), transparent 60%), radial-gradient(55% 50% at 95% 100%, oklch(0.80 0.12 85 / 0.12), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at 50% 30%, black, transparent 75%)",
        }}
      />
    </>
  );
}

type AuthPanelProps = {
  brandLabel: string;
  brandSubtitle: string;
  heading: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/** Panel de auth con barra degradada, halo y cabecera de marca. */
export function AuthPanel({
  brandLabel,
  brandSubtitle,
  heading,
  description,
  children,
  footer,
  className,
}: AuthPanelProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px -z-10 rounded-[1.6rem] opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, oklch(0.72 0.16 165 / 0.20), transparent 55%), radial-gradient(120% 90% at 100% 100%, oklch(0.80 0.12 85 / 0.16), transparent 55%)",
        }}
      />

      <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-panel)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />

        <div className="p-6 sm:p-8">
          <header className="mb-7 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] shadow-[0_0_24px_-4px_oklch(0.72_0.16_165/0.7)]">
              <Zap className="h-5 w-5 text-[var(--color-primary-foreground)]" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-[var(--color-foreground)]">{brandLabel}</p>
              <p className="text-[11px] text-[var(--color-foreground-subtle)]">{brandSubtitle}</p>
            </div>
          </header>

          <h2 className="mb-1 text-xl font-semibold tracking-tight text-[var(--color-foreground)]">{heading}</h2>
          {description && <p className="mb-6 text-sm text-[var(--color-foreground-muted)]">{description}</p>}

          {children}

          {footer}
        </div>
      </div>
    </div>
  );
}
