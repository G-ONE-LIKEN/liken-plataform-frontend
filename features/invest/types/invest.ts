import type { PageResponse } from "@/shared/types/api";

/**
 * Tier del inversor calculado en `invest-dividend-service` según el total USDC invertido.
 * Espejo del enum {@code com.plataforma.user.model.Tier} del user-service.
 */
export type Tier = "BRONZE" | "SILVER" | "GOLD";

/**
 * Compra primaria de LKN — espejo de {@code InvestmentResponse} del backend.
 *
 * Montos serializados como string (BigDecimal). `usdcAmount` en escala 6,
 * `lknAmount` en escala 8 (matchea project-service.user_holdings).
 */
export type InvestmentResponse = {
  id: number;
  userId: number;
  walletAddress: string;
  projectId: number;
  offeringContractAddress: string | null;
  usdcAmount: string;
  lknAmount: string;
  txHash: string;
  blockNumber: number;
  createdAt: string;
};

export type InvestmentsPage = PageResponse<InvestmentResponse>;

/**
 * Total acumulado del usuario + tier vigente.
 */
export type InvestmentTotalResponse = {
  userId: number;
  totalUsdcInvested: string;
  currentTier: Tier;
};

/**
 * Respuesta del endpoint de preview de compra.
 * El backend consulta `currentPrice` y `state` del proyecto antes de calcular
 * el `lknAmount` que recibiría el inversor.
 */
export type PreviewResponse = {
  projectId: number;
  state: string; // ProjectState — string libre para no atar con el otro tipo.
  currentPrice: string;
  usdcAmount: string;
  lknAmount: string;
  offeringContractAddress: string | null;
  canInvest: boolean;
  reason: string | null;
};

/**
 * Reclamo de dividendos registrado desde el evento {@code DividendsWithdrawn}.
 */
export type DividendClaimResponse = {
  id: number;
  userId: number;
  walletAddress: string;
  amount: string;
  txHash: string;
  blockNumber: number;
  createdAt: string;
};

export type DividendClaimsPage = PageResponse<DividendClaimResponse>;

/**
 * Lectura on-chain del {@code DividendDistributor.pendingDividends(wallet)}.
 * Si la address está sin configurar en el backend o el RPC falla, devuelve
 * {@code pendingUsdc: "0"}.
 */
export type PendingDividendsResponse = {
  walletAddress: string;
  pendingUsdc: string;
};
