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
  tokenPrice: string;
  minimumInvestment?: string;
  expectedAnnualYield?: string;
  installedCapacityMW?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
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
