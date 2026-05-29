"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId } from "wagmi";
import { sepolia } from "wagmi/chains";
import { formatCompactAddress } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";

export function WalletStatusCard() {
  const { address, chain, isConnected } = useAccount();
  const chainId = useChainId();
  const isWrongNetwork = isConnected && chainId !== sepolia.id;

  return (
    <Card
      title="Estado de wallet"
      description="La conexion blockchain ya esta disponible, pero confinada a su modulo para no cargar el resto del panel."
      actions={
        <Badge tone={isWrongNetwork ? "danger" : isConnected ? "success" : "neutral"}>
          {isWrongNetwork ? "Wrong network" : isConnected ? "Conectada" : "Desconectada"}
        </Badge>
      }
    >
      <div className="grid gap-4">
        <div className="grid gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm text-[var(--color-foreground-muted)]">
          <Row label="Address" value={formatCompactAddress(address)} />
          <Row label="Network" value={chain?.name ?? "Sin red"} />
          <Row label="Sepolia requerida" value={String(sepolia.id)} />
        </div>
        <div className="flex flex-wrap gap-3">
          <ConnectButton />
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
