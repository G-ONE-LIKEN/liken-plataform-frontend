"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { AuthPanel } from "@/features/auth/components/auth-shell";
import { Button } from "@/shared/ui/button";
import { useKyc } from "@/features/kyc/hooks/use-kyc";

export function KycVerify() {
  const router = useRouter();
  const { initiateKyc, isLoading, error } = useKyc();

  async function handleVerify() {
    const verificationUrl = await initiateKyc();
    if (verificationUrl) {
      window.location.href = verificationUrl;
    }
  }

  return (
    <AuthPanel
      brandLabel="Verificación de identidad"
      brandSubtitle="Powered by Didit"
      heading="Verificá tu identidad"
      description="Serás redirigido a Didit, nuestro proveedor de verificación seguro. El proceso tarda menos de 2 minutos."
    >
      <div className="mb-6 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
          <div className="space-y-1 text-sm text-[var(--color-foreground-muted)]">
            <p>Tené a mano tu <strong className="text-[var(--color-foreground)]">DNI</strong> (frente y dorso) y asegurate de estar en un lugar con buena iluminación para la selfie.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[rgba(214,69,93,0.3)] bg-[rgba(214,69,93,0.08)] px-4 py-3 text-sm text-[var(--color-danger)]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button
        className="h-11 w-full gap-2"
        onClick={handleVerify}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Iniciando verificación...
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            Verificar con Didit
          </>
        )}
      </Button>

      <button
        type="button"
        onClick={() => router.back()}
        className="mt-4 w-full text-center text-xs text-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)] transition-colors"
      >
        Volver
      </button>
    </AuthPanel>
  );
}