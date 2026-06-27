"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type { DividendPayoutsPage } from "@/features/invest/types/invest";

const KEY = ["dividend-payouts"];

/**
 * Historial de pagos de dividendos recibidos por el usuario logueado.
 * Endpoint: `GET /api/dividends/payouts/me`.
 *
 * <p>A diferencia de useMyDividends (que es el flujo legacy del
 * DividendDistributor donde el holder reclama manualmente), este endpoint
 * lista las transferencias USDC directas que el sistema hace automaticamente
 * por cada parque tras la lectura del oracle.
 */
export function useMyDividendPayouts(page = 0, size = 20) {
  const qs = `?page=${page}&size=${size}&sort=paidAt,desc`;
  return useQuery({
    queryKey: [...KEY, "mine", page, size],
    queryFn: async () => {
      const response = await apiClient.get<DividendPayoutsPage>(
        `/api/dividends/payouts/me${qs}`
      );
      return response.data;
    },
    refetchInterval: 30_000,
  });
}
