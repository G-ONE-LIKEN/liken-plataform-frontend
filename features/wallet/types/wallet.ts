import type { PageResponse } from "@/shared/types/api";

export type MovementType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "DIVIDEND"
  | "TOKEN_PURCHASE"
  | "P2P_SALE"
  | "P2P_PURCHASE";

export type WalletResponse = {
  id: number;
  userId: number;
  balance: string; // BigDecimal serializado como string, ej: "500.0000"
  currency: string;
  createdAt: string;
};

export type MovementResponse = {
  id: number;
  type: MovementType;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  description: string | null;
  referenceId: string | null;
  createdAt: string;
};

export type WalletMovementsPage = PageResponse<MovementResponse>;

export type DepositRequest = {
  amount: number;
  description?: string;
};

export type WithdrawRequest = {
  amount: number;
  description?: string;
};
