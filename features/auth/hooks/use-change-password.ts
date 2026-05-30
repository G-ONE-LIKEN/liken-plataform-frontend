"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export function useChangePassword() {
  return useMutation({
    mutationFn: async (body: ChangePasswordRequest) => {
      await apiClient.post("/api/auth/change-password", body);
    },
  });
}
