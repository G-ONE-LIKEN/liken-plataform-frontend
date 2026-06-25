"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldAlert, Clock, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKycGate } from "@/features/kyc/hooks/use-kyc-gate";

type KycGateProps = {
  /**
   * Acción crítica a habilitar solo si el KYC está aprobado. Opcional: si se
   * omite, KycGate funciona como gate puro (solo muestra el prompt cuando no
   * está aprobado, y nada cuando lo está).
   */
  children?: React.ReactNode;
  /**
   * Texto contextual sobre por qué se necesita el KYC en este lugar.
   * Ej: "Para invertir necesitás verificar tu identidad."
   */
  reason?: string;
};

/**
 * Gatea una acción crítica por estado de KYC (soft gate).
 *
 * Si el usuario está APPROVED, renderiza los children (la acción real).
 * En cualquier otro estado muestra un prompt acorde con CTA para verificar
 * o reintentar, redirigiendo a /kyc/welcome.
 *
 * El backend valida igual — esto es UX para no ofrecer acciones que van
 * a fallar y para guiar al usuario a completar su verificación.
 */
export function KycGate({ children, reason }: KycGateProps) {
  const router = useRouter();
  const { status, ready, isApproved } = useKycGate();

  // Mientras el contexto de sesión no resolvió, no mostramos ni la acción
  // ni un prompt (evita parpadeo de "verificá tu identidad" a un usuario ya aprobado).
  if (!ready) return null;

  if (isApproved) return <>{children ?? null}</>;

  const config = {
    NOT_STARTED: {
      icon: ShieldCheck,
      tone: "primary" as const,
      title: "Verificá tu identidad",
      description: reason ?? "Para operar en LIKEN necesitás verificar tu identidad. Tarda menos de 2 minutos.",
      cta: "Verificar identidad",
    },
    PENDING: {
      icon: Clock,
      tone: "warning" as const,
      title: "Verificación en proceso",
      description: "Estamos procesando tu verificación. Te habilitamos esta acción apenas se apruebe.",
      cta: null,
    },
    REJECTED: {
      icon: XCircle,
      tone: "danger" as const,
      title: "Verificación rechazada",
      description: "No pudimos verificar tu identidad. Revisá tus datos y volvé a intentarlo.",
      cta: "Reintentar verificación",
    },
    APPROVED: {
      icon: ShieldCheck,
      tone: "primary" as const,
      title: "",
      description: "",
      cta: null,
    },
  };

  const current = config[status];
  const Icon = current.icon;

  const toneClasses = {
    primary: "border-primary/30 bg-primary/5",
    warning: "border-yellow-500/30 bg-yellow-500/10",
    danger: "border-destructive/30 bg-destructive/5",
  }[current.tone];

  const iconClasses = {
    primary: "text-primary",
    warning: "text-yellow-600",
    danger: "text-destructive",
  }[current.tone];

  return (
    <div className={`flex flex-col gap-3 rounded-xl border p-5 ${toneClasses}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClasses}`} />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{current.title}</p>
          <p className="text-xs text-muted-foreground">{current.description}</p>
        </div>
      </div>
      {current.cta && (
        <Button
          className="gap-2 self-start"
          size="sm"
          onClick={() => router.push("/kyc/welcome")}
        >
          <ShieldAlert className="h-4 w-4" />
          {current.cta}
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
