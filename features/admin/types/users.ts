import type { PageResponse } from "@/shared/types/api";

export type RoleSummary = {
  id: number;
  name: string;
  permissions?: Array<{ id: number; name: string }>;
};

export type UserSummary = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  dni?: string;
  profileCompleted?: boolean;
  authProvider?: string;
  developerStatus?: "PENDING" | "APPROVED" | "REJECTED";
  active: boolean;
  tier?: string;
  kycStatus?: string;
  role?: RoleSummary;
  createdAt?: string;
};

export type UsersPage = PageResponse<UserSummary>;
