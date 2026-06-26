export interface OrderResponse {
  id: number;
  sellerId: number;
  projectId: number;
  side: "SELL" | "BUY";
  tokensAmount: number;
  pricePerToken: number;
  status: "OPEN" | "PENDING_SETTLEMENT" | "MATCHED" | "CANCELLED" | "EXPIRED";
  createdAt: string;
  expiresAt: string;
}

export interface CreateOrderRequest {
  projectId: number;
  tokensAmount: number;
  pricePerToken: number;
}
