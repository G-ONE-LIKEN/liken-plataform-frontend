"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";

export type MonthlyPoint = {
  period: string; // YYYY-MM
  primaryVolume: string;
  p2pVolume: string;
  primaryFees: string;
  p2pFees: string;
  revenue: string;
};

export type PlatformReport = {
  from: string;
  to: string;
  // Tasas
  primaryFeeRate: string;
  p2pFeeRate: string;
  // Revenue
  primaryFees: string;
  p2pFees: string;
  totalRevenue: string;
  // Volúmenes
  primaryVolume: string;
  primaryOperations: number;
  p2pVolume: string;
  p2pOperations: number;
  // Contexto
  totalDeposits: string;
  totalWithdrawals: string;
  // Serie temporal
  monthly: MonthlyPoint[];
};

export type ReportRange = {
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
};

export function usePlatformReport(range: ReportRange) {
  const params = new URLSearchParams();
  if (range.from) params.set("from", range.from);
  if (range.to)   params.set("to",   range.to);
  const qs = params.toString();
  const url = qs
    ? `/api/wallets/admin/platform-report?${qs}`
    : "/api/wallets/admin/platform-report";

  return useQuery({
    queryKey: ["platform-report", range.from ?? "", range.to ?? ""],
    queryFn: async () => {
      const response = await apiClient.get<PlatformReport>(url);
      return response.data;
    },
  });
}
