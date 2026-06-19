import { useState } from 'react';
import { apiClient } from '@/shared/lib/api-client';
import type { KycStatusResponse, KycInitiateResponse } from '@/features/kyc/types/kyc';

export function useKyc() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getKycStatus(): Promise<KycStatusResponse | null> {
    try {
      const response = await apiClient.get<KycStatusResponse>('/api/users/me/kyc');
      return response.data;
    } catch {
      return null;
    }
  }

  async function initiateKyc(): Promise<string | null> {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<KycInitiateResponse>(
        '/api/users/me/kyc/didit/initiate'
      );
      return response.data.verificationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar la verificación.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { getKycStatus, initiateKyc, isLoading, error };
}