import { env } from "@/shared/config/env";

/**
 * Addresses de los contratos GLOBALES de la plataforma (un único deploy por chain).
 * El `OfferingContract` NO está acá porque hay uno por proyecto — la address
 * viaja en {@link `ProjectSummary`} (`offeringContractAddress`) desde el backend.
 */
export const CONTRACTS = {
  linkenToken: env.lknAddress as `0x${string}`,
  registry: env.registryAddress as `0x${string}`,
  dividendDistributor: env.distributorAddress as `0x${string}`,
  usdc: env.usdcAddress as `0x${string}`,
} as const;

/** Convención de decimales por token (alineado con la chain). */
export const TOKEN_DECIMALS = {
  USDC: 6,
  LKN: 18,
  /** Precios en USDC/LKN se expresan con 6 decimales en los contratos. */
  PRICE: 6,
} as const;

/** Mapeo del enum on-chain `OfferingContract.state` (uint8) a etiqueta legible. */
export const ROUND_STATE_LABEL = [
  "PENDING",
  "OPEN",
  "FINALIZED",
  "FAILED",
] as const;

/** Mapeo del enum on-chain `ProjectRegistry.Stage` (uint8) a etiqueta legible. */
export const REGISTRY_STAGE_LABEL = [
  "FUNDING",
  "ACTIVE",
  "PAUSED",
] as const;

/** URL de Etherscan para una tx o address. */
export function explorerTxUrl(txHash: string): string {
  return `${env.blockExplorerUrl}/tx/${txHash}`;
}
export function explorerAddressUrl(address: string): string {
  return `${env.blockExplorerUrl}/address/${address}`;
}
