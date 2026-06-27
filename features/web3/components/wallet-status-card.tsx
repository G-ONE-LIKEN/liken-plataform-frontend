"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { sepolia } from "wagmi/chains";
import { formatUnits } from "viem";
import { Wallet } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkWalletButton } from "@/features/web3/components/link-wallet-button";
import { formatCompactAddress } from "@/shared/lib/utils";

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
    <Card className="h-full overflow-hidden bg-card">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Mi wallet blockchain</p>
                <p className="text-xs text-muted-foreground">Saldo y estado de tu wallet de MetaMask conectada a Sepolia.</p>
              </div>
            </div>
            <Badge tone={isWrongNetwork ? "danger" : isConnected ? "success" : "neutral"}>
              {isWrongNetwork ? "Wrong network" : isConnected ? "Conectada" : "Desconectada"}
            </Badge>
          </div>

          <div className="mt-5 grid gap-4">
            {isConnected && (
              <div className="rounded-2xl border border-border/60 bg-secondary/40 px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Saldo ETH
                </p>
                {ethLoading ? (
                  <Skeleton className="mt-1 h-8 w-32" />
                ) : (
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {formattedEth} <span className="text-lg font-medium text-muted-foreground">ETH</span>
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile label="Address" value={formatCompactAddress(address)} />
              <InfoTile label="Red" value={chain?.name ?? "Sin red"} />
            </div>

            <div className="rounded-xl border border-border/60 bg-secondary/40 px-4 py-4">
              <LinkWalletButton />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/40 px-4 py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
