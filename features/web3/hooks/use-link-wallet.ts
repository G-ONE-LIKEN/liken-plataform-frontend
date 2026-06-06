"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useSignMessage } from "wagmi";
import { apiClient } from "@/shared/lib/api-client";
import { useSession } from "@/providers/session-provider";

/**
 * Orquesta el flujo de vínculo de wallet on-chain (custodia híbrida).
 *
 * <ol>
 *   <li>{@code POST /api/users/me/wallet/nonce} → backend devuelve {nonce, message}.</li>
 *   <li>{@code signMessageAsync({ message })} → MetaMask pide al usuario firmar.</li>
 *   <li>{@code POST /api/users/me/wallet} con {walletAddress, signature} → el backend
 *       verifica con {@code ecrecover} y persiste la dirección en EIP-55.</li>
 *   <li>Refresca el contexto de sesión para que {@code sessionUser.walletAddress}
 *       quede disponible en toda la app.</li>
 * </ol>
 */
export function useLinkWallet() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { refreshContext } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!isConnected || !address) {
        throw new Error("Conectá tu wallet primero (MetaMask).");
      }

      // 1. Pedir nonce al backend.
      const nonceResponse = await apiClient.post<{ nonce: string; message: string }>(
        "/api/users/me/wallet/nonce",
        {}
      );
      const message = nonceResponse.data.message;

      // 2. Firmar con MetaMask (EIP-191 / personal_sign — wagmi/viem lo manejan).
      const signature = await signMessageAsync({ account: address, message });

      // 3. Mandar al backend para verificación + persistencia.
      const result = await apiClient.post<{ walletAddress: string }>("/api/users/me/wallet", {
        walletAddress: address,
        signature,
      });

      return result.data;
    },
    onSuccess: async () => {
      // El contexto de sesión guarda `walletAddress`. Tras vincular,
      // refrescamos para que toda la UI lo refleje sin recargar.
      await refreshContext();
      await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}
