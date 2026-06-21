import type { PageResponse } from "@/shared/types/api";

export type MovementType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "DIVIDEND"
  | "TOKEN_PURCHASE"
  /** Devolución de USDC al inversor por soft cap missed (OfferingContract.refund). */
  | "REFUND"
  | "P2P_SALE"
  | "P2P_PURCHASE";

/** Etiqueta legible y tono visual asociado a cada tipo de movimiento. */
export const MOVEMENT_LABEL: Record<MovementType, { label: string; tone: "success" | "danger" | "neutral" | "warning" }> = {
  DEPOSIT:        { label: "Depósito",          tone: "success" },
  WITHDRAWAL:     { label: "Retiro",            tone: "danger"  },
  DIVIDEND:       { label: "Dividendo on-chain", tone: "success" },
  TOKEN_PURCHASE: { label: "Compra de LKN",     tone: "danger"  },
  REFUND:         { label: "Refund de ronda",   tone: "warning" },
  P2P_SALE:       { label: "Venta P2P",         tone: "success" },
  P2P_PURCHASE:   { label: "Compra P2P",        tone: "danger"  },
};

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

export type UserHoldingResponse = {
  projectId: number;
  userId: number;
  tokensAmount: number;
  usdcInvested: number;
};
