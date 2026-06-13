import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { OrderResponse, CreateOrderRequest } from "../types";

export function useOpenOrders(projectId?: number) {
  return useQuery({
    queryKey: ["marketplace-orders", projectId],
    queryFn: async () => {
      const url = projectId 
        ? `/api/marketplace/orders?projectId=${projectId}` 
        : `/api/marketplace/orders`;
      const res = await apiClient.get<OrderResponse[]>(url);
      return res.data;
    },
    refetchInterval: 5000,
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ["marketplace-my-orders"],
    queryFn: async () => {
      const res = await apiClient.get<OrderResponse[]>("/api/marketplace/orders/me");
      return res.data;
    },
    refetchInterval: 3000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: CreateOrderRequest) => {
      const res = await apiClient.post<OrderResponse>("/api/marketplace/orders", request);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-orders"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-my-orders"] });
    },
  });
}

export function useBuyOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await apiClient.post(`/api/marketplace/orders/${orderId}/buy`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-orders"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-my-orders"] });
    },
  });
}
