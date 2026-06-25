"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "@/providers/session-provider";
import type { KycStatus } from "@/features/kyc/types/kyc";

/**
 * Fuente de verdad del estado KYC para gatear acciones críticas (invertir,
 * comprar/vender en marketplace).
 *
 * Lee `user.kycStatus` de la sesión — el mismo dato que `GET /api/users/me`
 * expone y que el backend usa para gatear. No hace fetch propio: así todos
 * los gates de la UI comparten un único estado consistente.
 *
 * `refresh()` re-consulta el contexto de sesión (útil al volver de Didit).
 * `pollUntilSettled()` reintenta unas veces porque el webhook de Didit puede
 * tardar un par de segundos en impactar el estado tras la redirección.
 */
export function useKycGate() {
  const { user, refreshContext } = useSession();
  // `kycStatus` undefined = contexto de sesión todavía no resuelto.
  // Lo distinguimos de NOT_STARTED para no parpadear gates/banners al cargar.
  const ready = user?.kycStatus !== undefined;
  const status: KycStatus = user?.kycStatus ?? "NOT_STARTED";

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // Reintenta refrescar el contexto hasta que el estado salga de PENDING/NOT_STARTED
  // o se agoten los intentos. Pensado para el retorno desde el widget de Didit.
  const pollUntilSettled = useCallback(
    (attempts = 5, intervalMs = 2000) => {
      stopPolling();
      let remaining = attempts;
      void refreshContext();
      pollRef.current = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          stopPolling();
          return;
        }
        void refreshContext();
      }, intervalMs);
    },
    [refreshContext, stopPolling],
  );

  // Si el estado deja de estar "en tránsito", cortamos el polling.
  useEffect(() => {
    if (status === "APPROVED" || status === "REJECTED") {
      stopPolling();
    }
  }, [status, stopPolling]);

  useEffect(() => stopPolling, [stopPolling]);

  return {
    status,
    ready,
    isApproved: status === "APPROVED",
    isPending: status === "PENDING",
    isRejected: status === "REJECTED",
    notStarted: status === "NOT_STARTED",
    refresh: refreshContext,
    pollUntilSettled,
  };
}
