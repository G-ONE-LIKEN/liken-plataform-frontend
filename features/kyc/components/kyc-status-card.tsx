"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Clock, XCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useKycGate } from "@/features/kyc/hooks/use-kyc-gate";

const STATUS_CONFIG = {
  NOT_STARTED: {
    icon: AlertTriangle,
    label: "Sin verificar",
    badgeClass: "bg-secondary text-muted-foreground",
    description: "Verificá tu identidad para poder invertir y operar en el marketplace.",
    cta: "Verificar identidad",
  },
  PENDING: {
    icon: Clock,
    label: "En revisión",
    badgeClass: "bg-yellow-500/10 text-yellow-600",
    description: "Tu verificación está siendo procesada. Te avisamos apenas se resuelva.",
    cta: null,
  },
  APPROVED: {
    icon: ShieldCheck,
    label: "Verificado",
    badgeClass: "bg-green-500/10 text-green-500",
    description: "Tu identidad está verificada. Podés invertir y operar sin restricciones.",
    cta: null,
  },
  REJECTED: {
    icon: XCircle,
    label: "Rechazado",
    badgeClass: "bg-destructive/10 text-destructive",
    description: "No pudimos verificar tu identidad. Revisá tus datos e intentá nuevamente.",
    cta: "Reintentar verificación",
  },
} as const;

/**
 * Tarjeta de estado KYC para la página de cuenta. Muestra el estado actual
 * y un CTA para verificar/reintentar según corresponda.
 */
export function KycStatusCard() {
  const router = useRouter();
  const { status, ready } = useKycGate();

  if (!ready) return null;

  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Verificación de identidad
        </CardTitle>
        <CardDescription>Estado de tu KYC en LIKEN</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Estado</span>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.badgeClass}`}>
            {config.label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{config.description}</p>
        {config.cta && (
          <Button className="gap-2" onClick={() => router.push("/kyc/welcome")}>
            {config.cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
