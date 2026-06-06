import type { PageResponse } from "@/shared/types/api";

export type ProjectState =
  | "PENDING_APPROVAL"
  | "DRAFT"
  | "PRE_OPEN"
  | "OPEN"
  | "CLOSED"
  | "CANCELLED";

export type EnergyType = "SOLAR" | "WIND" | "HYDRO" | "BIOMASS";

/**
 * Estado del deploy on-chain del `OfferingContract` de un proyecto.
 * Espejo del enum Java `OnChainStatus` del project-service (V7).
 */
export type OnChainStatus = "NOT_DEPLOYED" | "DEPLOYING" | "DEPLOYED" | "FAILED";

/**
 * Estado on-chain de la ronda primaria (refleja `OfferingContract.state`).
 * Espejo del enum Java `RoundState` del project-service.
 */
export type RoundState = "PENDING" | "OPEN" | "FINALIZED" | "FAILED";

export type ProjectSummary = {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  state: ProjectState;
  energyType: EnergyType;
  province: string;
  country: string;
  /** LKN asignados al tramo de venta primaria de este proyecto. NO es cap de mint. */
  totalTokens: string;

  // ── Precios (V7: token global, dos precios por etapa) ──
  /** Precio etapa FUNDING (ronda abierta), serializado como string BigDecimal. */
  earlyBirdPrice: string;
  /** Precio etapa ACTIVE (post-ronda), serializado como string BigDecimal. */
  standardPrice: string;
  /** Precio vigente que devuelve el backend (espejo de `ProjectRegistry.currentPrice`). */
  currentPrice: string;

  minimumInvestment: string;
  softCap?: string;
  hardCap?: string;
  /**
   * Fecha esperada de apertura del parque. También funciona como deadline del
   * soft cap (es el {@code OfferingContract.deadline} on-chain). Si llega esta fecha
   * sin alcanzar el {@code softCap}, la ronda falla y los inversores reclaman refund.
   */
  expectedOpenDate?: string;
  raisedAmount?: string;
  expectedAnnualYield: string;
  expectedAnnualProductionMWh?: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: number | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;

  // ── Identificadores on-chain (poblados por el Blockchain Service) ──
  registryProjectId?: number | null;
  offeringContractAddress?: string | null;
  deployTxHash?: string | null;
  deployBlockNumber?: number | null;
  onChainStatus: OnChainStatus;
  roundState?: RoundState | null;
};

export type ProjectDetail = ProjectSummary & {
  latitude: string;
  longitude: string;
  installedCapacityMW: string;
};

export type ProjectsPage = PageResponse<ProjectSummary>;
