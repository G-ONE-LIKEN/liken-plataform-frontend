"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type { UsersPage } from "@/features/admin/types/users";

export type DeveloperStatus = "PENDING" | "APPROVED" | "REJECTED";

const DEVELOPERS_KEY = ["developers"];

export function useDevelopers(status?: DeveloperStatus) {
  return useQuery({
    queryKey: [...DEVELOPERS_KEY, status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : "";
      const response = await apiClient.get<UsersPage>(`/api/users/developers${params}`);
      return response.data;
    },
  });
}

export function useUpdateDeveloperStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: DeveloperStatus }) => {
      await apiClient.put(`/api/users/${userId}/developer-status`, { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DEVELOPERS_KEY }),
  });
}
