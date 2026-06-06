"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type {
  DividendClaimsPage,
  PendingDividendsResponse,
} from "@/features/invest/types/invest";

const KEY = ["dividends"];

/**
 * Historial de claims del usuario logueado.
 * Endpoint: `GET /api/dividends/me`.
 */
export function useMyDividends(page = 0, size = 20) {
  return useQuery({
    queryKey: [...KEY, "mine", page, size],
    queryFn: async () => {
      const response = await apiClient.get<DividendClaimsPage>(
        `/api/dividends/me?page=${page}&size=${size}`
      );
      return response.data;
    },
  });
}

/**
 * Dividendos pendientes on-chain para una wallet.
 *
 * <p>El backend ejecuta {@code DividendDistributor.pendingDividends(wallet)}
 * con {@code eth_call} (no gasta gas). Si la wallet no es válida o no está
 * configurada la address del distributor en el backend, devuelve {@code "0"}.
 */
export function usePendingDividends(walletAddress: string | null | undefined) {
  const enabled = Boolean(walletAddress && walletAddress.match(/^0x[a-fA-F0-9]{40}$/));

  return useQuery({
    queryKey: [...KEY, "pending", walletAddress],
    enabled,
    queryFn: async () => {
      const response = await apiClient.get<PendingDividendsResponse>(
        `/api/dividends/pending?wallet=${walletAddress}`
      );
      return response.data;
    },
    // Polling cada 30s: los dividendos cambian sólo cuando la plataforma
    // deposita o el holder retira; no hace falta más agresivo.
    refetchInterval: 30_000,
  });
}
