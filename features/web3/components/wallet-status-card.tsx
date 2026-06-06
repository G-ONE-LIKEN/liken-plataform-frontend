"use client";

import { useAccount, useChainId, useBalance } from "wagmi";
import { sepolia } from "wagmi/chains";
import { formatUnits } from "viem";
import { formatCompactAddress } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkWalletButton } from "@/features/web3/components/link-wallet-button";

export function WalletStatusCard() {
  const { address, chain, isConnected } = useAccount();
  const chainId = useChainId();
  const isWrongNetwork = isConnected && chainId !== sepolia.id;

  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address,
    query: { enabled: isConnected && !!address },
  });

  const formattedEth = ethBalance
    ? Number(formatUnits(ethBalance.value, 18)).toLocaleString("es-AR", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
    : null;

  return (
    <Card
      title="Mi wallet blockchain"
      description="Saldo y estado de tu wallet de MetaMask conectada a Sepolia."
      actions={
        <Badge tone={isWrongNetwork ? "danger" : isConnected ? "success" : "neutral"}>
          {isWrongNetwork ? "Wrong network" : isConnected ? "Conectada" : "Desconectada"}
        </Badge>
      }
    >
      <div className="grid gap-4">
        {/* ETH Balance highlight */}
        {isConnected && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-foreground-subtle)]">
              Saldo ETH
            </p>
            {ethLoading ? (
              <Skeleton className="mt-1 h-8 w-32" />
            ) : (
              <p className="mt-1 text-3xl font-bold text-[var(--color-foreground)]">
                {formattedEth} <span className="text-lg font-medium text-[var(--color-foreground-muted)]">ETH</span>
              </p>
            )}
          </div>
        )}

        {/* Details */}
        <div className="grid gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm text-[var(--color-foreground-muted)]">
          <Row label="Address" value={formatCompactAddress(address)} />
          <Row label="Red" value={chain?.name ?? "Sin red"} />
        </div>

        {/* Vínculo wallet ↔ cuenta Liken (Fase 1 backend).
            Detecta los 4 estados: no conectada, conectada-sin-vincular,
            vinculada-y-coincide, vinculada-con-mismatch. */}
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
          <LinkWalletButton />
        </div>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="font-semibold text-[var(--color-foreground)]">{value}</span>
    </div>
  );
}
