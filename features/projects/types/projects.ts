import type { PageResponse } from "@/shared/types/api";

export type ProjectState = "DRAFT" | "PRE_OPEN" | "OPEN" | "CLOSED" | "CANCELLED";
export type EnergyType = "SOLAR" | "WIND" | "HYDRO" | "BIOMASS";

export type ProjectSummary = {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  state: ProjectState;
  energyType: EnergyType;
  province: string;
  country: string;
  totalTokens: string;
  tokenPrice: string;
  minimumInvestment: string;
  expectedAnnualYield: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetail = ProjectSummary & {
  latitude: string;
  longitude: string;
  installedCapacityMW: string;
};

export type ProjectsPage = PageResponse<ProjectSummary>;
