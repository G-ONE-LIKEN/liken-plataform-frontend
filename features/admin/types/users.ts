import type { PageResponse } from "@/shared/types/api";

export type RoleSummary = {
  id: number;
  name: string;
  permissions?: Array<{ id: number; name: string }>;
};

export type UserSummary = {
  id: number;
  email: string;
  active: boolean;
  tier?: string;
  kycStatus?: string;
  role?: RoleSummary;
  createdAt?: string;
};

export type UsersPage = PageResponse<UserSummary>;
