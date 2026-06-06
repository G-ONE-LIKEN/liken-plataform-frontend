"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type { ProjectDetail, ProjectsPage } from "@/features/projects/types/projects";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await apiClient.get<ProjectsPage>("/api/projects");
      return response.data;
    },
  });
}

export function useMyProjects() {
  return useQuery({
    queryKey: ["projects", "mine"],
    queryFn: async () => {
      const response = await apiClient.get<ProjectsPage>("/api/projects/mine");
      return response.data;
    },
    refetchInterval: (query) =>
      query.state.data?.content?.some((project) => project.onChainStatus === "DEPLOYING")
        ? 5000
        : false,
  });
}

/**
 * Lista paginada por estado. Útil para admin: pasando state=PENDING_APPROVAL
 * trae los pending, pasando OPEN trae los abiertos, etc.
 */
export function useProjectsByState(state?: string, pageSize = 50) {
  return useQuery({
    queryKey: ["projects", "by-state", state ?? "all"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (state) params.set("state", state);
      params.set("size", String(pageSize));
      const response = await apiClient.get<ProjectsPage>(`/api/projects?${params.toString()}`);
      return response.data;
    },
  });
}

export function usePendingApprovalProjects() {
  return useQuery({
    queryKey: ["projects", "pending-approval"],
    queryFn: async () => {
      const response = await apiClient.get<ProjectsPage>("/api/projects/pending-approval");
      return response.data;
    },
  });
}

export function useProjectDetail(id: number) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const response = await apiClient.get<ProjectDetail>(`/api/projects/${id}`);
      return response.data;
    },
    enabled: Number.isFinite(id),
    refetchInterval: (query) =>
      query.state.data?.onChainStatus === "DEPLOYING" ? 5000 : false,
  });
}
