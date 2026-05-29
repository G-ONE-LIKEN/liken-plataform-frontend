"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type { UsersPage } from "@/features/admin/types/users";

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get<UsersPage>("/api/users");
      return response.data;
    },
    enabled,
  });
}
