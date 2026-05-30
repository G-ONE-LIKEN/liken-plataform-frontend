"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";

export type PermissionItem = {
  id: number;
  name: string;
  description: string;
};

export type RoleDetail = {
  id: number;
  name: string;
  description: string;
  active: boolean;
  permissions: PermissionItem[];
};

const ROLES_KEY = ["roles"];
const PERMISSIONS_KEY = ["permissions"];

export function usePermissions() {
  return useQuery({
    queryKey: PERMISSIONS_KEY,
    queryFn: async () => {
      const response = await apiClient.get<PermissionItem[]>("/api/permissions");
      return response.data;
    },
  });
}

export function useRolesDetail() {
  return useQuery({
    queryKey: ROLES_KEY,
    queryFn: async () => {
      const response = await apiClient.get<RoleDetail[]>("/api/roles");
      return response.data;
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; description: string }) => {
      const response = await apiClient.post<RoleDetail>("/api/roles", body);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roleId: number) => {
      await apiClient.del(`/api/roles/${roleId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}

export function useAssignPermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleId, permissionIds }: { roleId: number; permissionIds: number[] }) => {
      await apiClient.put(`/api/roles/${roleId}/permissions`, permissionIds);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; description: string }) => {
      const response = await apiClient.post<PermissionItem>("/api/permissions", body);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PERMISSIONS_KEY }),
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (permissionId: number) => {
      await apiClient.del(`/api/permissions/${permissionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
    },
  });
}
