"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";

export type RoleOption = {
  id: number;
  name: string;
  description: string;
};

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await apiClient.get<RoleOption[]>("/api/roles");
      return response.data;
    },
  });
}
