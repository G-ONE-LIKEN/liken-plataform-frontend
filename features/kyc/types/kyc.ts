export type KycStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface KycStatusResponse {
  status: KycStatus;
}

export interface KycInitiateResponse {
  verificationUrl: string;
}