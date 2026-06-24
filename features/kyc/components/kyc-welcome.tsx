"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, Camera, ArrowRight } from "lucide-react";
import { AuthPanel } from "@/features/auth/components/auth-shell";
import { Button } from "@/shared/ui/button";

const steps = [
  { icon: CreditCard, text: "Foto del frente y dorso de tu DNI" },
  { icon: Camera, text: "Selfie para verificar que sos vos" },
  { icon: ShieldCheck, text: "El proceso tarda menos de 2 minutos" },
];

export function KycWelcome() {
  const router = useRouter();

  return (
    <AuthPanel
      brandLabel="Verificación de identidad"
      brandSubtitle="Requerida para invertir en LIKEN"
      heading="Un paso más antes de invertir"
      description="Para operar en la plataforma necesitamos verificar tu identidad. Es un proceso rápido y seguro."
    >
      <ul className="mb-6 space-y-3">
        {steps.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10">
              <Icon className="h-4 w-4 text-[var(--color-primary)]" />
            </div>
            <span className="text-sm text-[var(--color-foreground-muted)]">{text}</span>
          </li>
        ))}
      </ul>

      <Button
        className="h-11 w-full gap-2"
        onClick={() => router.push("/kyc/verify")}
      >
        Continuar
        <ArrowRight className="h-4 w-4" />
      </Button>

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="mt-4 w-full text-center text-xs text-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)] transition-colors"
      >
        Verificar más tarde
      </button>
    </AuthPanel>
  );
}