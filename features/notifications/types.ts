import type { PageResponse } from "@/shared/types/api";

export type NotificationType =
  | "ADMIN_DEVELOPER_PENDING"
  | "ADMIN_PROJECT_PENDING"
  | "DEVELOPER_STATUS_CHANGED"
  | "PROJECT_APPROVED"
  | "PROJECT_REJECTED"
  | "INVESTMENT_CONFIRMED"
  | "DIVIDEND_RECEIVED"
  | "WALLET_FUNDED"
  | "WALLET_DEBITED"
  | "BROADCAST";

export type AppNotification = {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown>;
  read: boolean;
  readAt: string | null;
  createdAt: string;
};

export type NotificationsPage = PageResponse<AppNotification>;
