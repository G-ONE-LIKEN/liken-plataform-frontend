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

export function useProjectDetail(id: number) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const response = await apiClient.get<ProjectDetail>(`/api/projects/${id}`);
      return response.data;
    },
    enabled: Number.isFinite(id),
  });
}
