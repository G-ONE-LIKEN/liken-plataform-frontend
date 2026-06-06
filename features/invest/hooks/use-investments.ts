"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type {
  InvestmentsPage,
  InvestmentTotalResponse,
  PreviewResponse,
} from "@/features/invest/types/invest";

const KEY = ["invest"];

/**
 * Lista paginada de compras primarias del usuario logueado.
 * Endpoint: `GET /api/investments/me`.
 */
export function useMyInvestments(page = 0, size = 20) {
  return useQuery({
    queryKey: [...KEY, "investments", page, size],
    queryFn: async () => {
      const response = await apiClient.get<InvestmentsPage>(
        `/api/investments/me?page=${page}&size=${size}`
      );
      return response.data;
    },
  });
}

/**
 * Total USDC invertido + tier vigente del usuario logueado.
 * Endpoint: `GET /api/investments/me/total`.
 */
export function useInvestmentTotal() {
  return useQuery({
    queryKey: [...KEY, "total"],
    queryFn: async () => {
      const response = await apiClient.get<InvestmentTotalResponse>(
        "/api/investments/me/total"
      );
      return response.data;
    },
  });
}

/**
 * Preview de compra: dado un proyecto y un monto USDC, calcula cuántos LKN
 * recibe el inversor al precio vigente del proyecto. El backend consulta
 * project-service para obtener `currentPrice` + `state`.
 *
 * <p>Sólo se activa si {@code usdcAmount > 0}.
 */
export function usePreviewInvestment(projectId: number | null, usdcAmount: string) {
  const numeric = Number(usdcAmount);
  const enabled =
    projectId !== null &&
    Number.isFinite(numeric) &&
    numeric > 0;

  return useQuery({
    queryKey: [...KEY, "preview", projectId, usdcAmount],
    enabled,
    queryFn: async () => {
      const response = await apiClient.get<PreviewResponse>(
        `/api/investments/preview?projectId=${projectId}&usdcAmount=${usdcAmount}`
      );
      return response.data;
    },
    // El preview no muta — cache 5 segundos para no spammear al backend mientras
    // el usuario tipea, pero refrescar si el monto cambia.
    staleTime: 5_000,
  });
}
