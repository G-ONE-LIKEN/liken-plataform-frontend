"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type { ProjectSummary, ProjectState, EnergyType } from "@/features/projects/types/projects";

export type CreateProjectRequest = {
  name: string;
  description: string;
  energyType: EnergyType;
  province?: string;
  country?: string;
  totalTokens: string;

  /**
   * Precio en USDC por LKN durante la etapa FUNDING (ronda abierta).
   * Debe ser estrictamente menor que `standardPrice`.
   */
  earlyBirdPrice: string;
  /**
   * Precio en USDC por LKN post-ronda (etapa ACTIVE). Debe ser mayor que
   * `earlyBirdPrice`. Mismo invariante que el contrato `ProjectRegistry.sol`.
   */
  standardPrice: string;
  softCap?: string;
  hardCap?: string;

  minimumInvestment?: string;
  expectedAnnualYield?: string;
  installedCapacityMW?: string;
  /**
   * Apertura esperada del parque (YYYY-MM-DD). Único campo de fecha que el form
   * pide al usuario: cumple doble función — es el inicio de operación y el
   * deadline implícito del soft cap (Fase 6).
   */
  expectedOpenDate?: string;
  latitude?: string;
  longitude?: string;
};

const PROJECTS_KEY = ["projects"];

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateProjectRequest) => {
      const response = await apiClient.post<ProjectSummary>("/api/projects", body);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}

export function useUpdateProject(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<CreateProjectRequest>) => {
      const response = await apiClient.put<ProjectSummary>(`/api/projects/${id}`, body);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}

export function useChangeProjectState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, state }: { id: number; state: ProjectState }) => {
      const response = await apiClient.put<ProjectSummary>(`/api/projects/${id}/state`, { state });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}

export function useApproveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.post<ProjectSummary>(`/api/projects/${id}/approve`, {});
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}

export function useRejectProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
      const response = await apiClient.post<ProjectSummary>(`/api/projects/${id}/reject`, {
        reason: reason ?? null,
      });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}
