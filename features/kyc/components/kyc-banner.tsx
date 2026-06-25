"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Clock, XCircle, AlertTriangle, X } from "lucide-react";
import { useKycGate } from "@/features/kyc/hooks/use-kyc-gate";

export function KycBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, ready, pollUntilSettled } = useKycGate();
  const [dismissed, setDismissed] = useState(false);

  // Al volver del widget de Didit (?kyc=done), el webhook puede tardar un
  // par de segundos en impactar. Refrescamos el contexto con reintentos.
  useEffect(() => {
    if (searchParams.get("kyc") === "done") {
      pollUntilSettled();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Banner APPROVED desaparece solo a los 5 segundos
  useEffect(() => {
    if (status === "APPROVED") {
      const timer = setTimeout(() => setDismissed(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (dismissed || !ready) return null;

  const config = {
    APPROVED: {
      icon: ShieldCheck,
      text: "Identidad verificada. Ya podés invertir en LIKEN.",
      action: null,
      className: "border-[rgba(38,116,88,0.3)] bg-[rgba(38,116,88,0.08)] text-[var(--color-foreground)]",
      iconClass: "text-[var(--color-primary)]",
    },
    NOT_STARTED: {
      icon: AlertTriangle,
      text: "Verificá tu identidad para empezar a invertir en LIKEN.",
      action: "Verificar ahora",
      className: "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 text-[var(--color-foreground)]",
      iconClass: "text-[var(--color-primary)]",
    },
    PENDING: {
      icon: Clock,
      text: "Tu verificación está siendo procesada. Te avisaremos cuando esté lista.",
      action: null,
      className: "border-yellow-500/20 bg-yellow-500/5 text-[var(--color-foreground)]",
      iconClass: "text-yellow-500",
    },
    REJECTED: {
      icon: XCircle,
      text: "No pudimos verificar tu identidad.",
      action: "Intentar nuevamente",
      className: "border-[rgba(214,69,93,0.3)] bg-[rgba(214,69,93,0.08)] text-[var(--color-foreground)]",
      iconClass: "text-[var(--color-danger)]",
    },
  } as const;

  const current = config[status as keyof typeof config];
  if (!current) return null;
  const Icon = current.icon;

  return (
    <div className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${current.className}`}>
      <Icon className={`h-4 w-4 shrink-0 ${current.iconClass}`} />
      <span className="flex-1 text-[var(--color-foreground-muted)]">{current.text}</span>
      {current.action && (
        <button
          onClick={() => router.push("/kyc/welcome")}
          className="shrink-0 font-semibold text-[var(--color-primary)] hover:underline"
        >
          {current.action}
        </button>
      )}
      {(status === "NOT_STARTED" || status === "APPROVED") && (
        <button
          onClick={() => setDismissed(true)}
          className="ml-1 shrink-0 text-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)]"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
