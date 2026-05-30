"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type {
  WalletResponse,
  WalletMovementsPage,
  DepositRequest,
  WithdrawRequest,
} from "@/features/wallet/types/wallet";

const WALLET_KEY = ["wallet"];
const MOVEMENTS_KEY = ["wallet", "movements"];

export function useWallet() {
  return useQuery({
    queryKey: WALLET_KEY,
    queryFn: async () => {
      const response = await apiClient.get<WalletResponse>("/api/wallets/me");
      return response.data;
    },
  });
}

export function useWalletMovements(page = 0, size = 20) {
  return useQuery({
    queryKey: [...MOVEMENTS_KEY, page, size],
    queryFn: async () => {
      const response = await apiClient.get<WalletMovementsPage>(
        `/api/wallets/me/movements?page=${page}&size=${size}`
      );
      return response.data;
    },
  });
}

export function useDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: DepositRequest) => {
      const response = await apiClient.post<WalletResponse>("/api/wallets/deposit", body);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_KEY });
      queryClient.invalidateQueries({ queryKey: MOVEMENTS_KEY });
    },
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: WithdrawRequest) => {
      const response = await apiClient.post<WalletResponse>("/api/wallets/withdraw", body);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_KEY });
      queryClient.invalidateQueries({ queryKey: MOVEMENTS_KEY });
    },
  });
}
