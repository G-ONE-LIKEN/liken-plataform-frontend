"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircle2, AlertTriangle, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/shared/ui/badge";
import { formatCompactAddress } from "@/shared/lib/utils";
import { useSession } from "@/providers/session-provider";
import { useLinkWallet } from "@/features/web3/hooks/use-link-wallet";
import { toast } from "@/hooks/use-toast";

/**
 * Componente unificado para el flujo de vínculo wallet ↔ cuenta Liken.
 *
 * Estados visuales:
 *  - Wallet vinculada y coincide con la conectada → muestra check + address.
 *  - Wallet vinculada pero la conectada es OTRA → warning de mismatch.
 *  - Wallet conectada y NO vinculada → CTA "Vincular wallet a mi cuenta".
 *  - Wallet no conectada → muestra `ConnectButton` de RainbowKit.
 */
export function LinkWalletButton() {
  const { address: connectedAddress, isConnected } = useAccount();
  const { user } = useSession();
  const linkMutation = useLinkWallet();

  const linkedAddress = user?.walletAddress ?? null;
  const isLinked = Boolean(linkedAddress);
  const isSameAccount =
    isLinked && isConnected && connectedAddress?.toLowerCase() === linkedAddress?.toLowerCase();
  const isMismatch = isLinked && isConnected && !isSameAccount;

  async function handleLink() {
    try {
      await linkMutation.mutateAsync();
      toast({
        title: "Wallet vinculada",
        description: "Tu wallet on-chain quedó asociada a tu cuenta Liken.",
      });
    } catch (err) {
      toast({
        title: "No pudimos vincular tu wallet",
        description: err instanceof Error ? err.message : "Intentá de nuevo.",
        variant: "destructive",
      });
    }
  }

  if (isSameAccount) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="success">
          <CheckCircle2 className="mr-1 inline h-3 w-3" />
          Wallet vinculada
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">
          {formatCompactAddress(linkedAddress!)}
        </span>
      </div>
    );
  }

  if (isMismatch) {
    return (
      <div className="space-y-2">
        <Badge tone="danger">
          <AlertTriangle className="mr-1 inline h-3 w-3" />
          Wallet conectada distinta a la vinculada
        </Badge>
        <p className="text-xs text-muted-foreground">
          Tu cuenta está vinculada a{" "}
          <span className="font-mono">{formatCompactAddress(linkedAddress!)}</span>, pero MetaMask
          tiene activa{" "}
          <span className="font-mono">{formatCompactAddress(connectedAddress!)}</span>. Cambiá la
          cuenta activa en MetaMask para operar.
        </p>
      </div>
    );
  }

  if (isConnected && !isLinked) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Conectaste tu wallet pero todavía no está vinculada a tu cuenta Liken. Firmá un mensaje
          para probar que sos la dueña (no se gasta gas).
        </p>
        <Button
          onClick={handleLink}
          disabled={linkMutation.isPending}
          className="gap-2"
        >
          {linkMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          Vincular {formatCompactAddress(connectedAddress!)} a mi cuenta
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Conectá tu wallet (MetaMask) para vincularla a tu cuenta Liken.
      </p>
      <ConnectButton />
    </div>
  );
}
