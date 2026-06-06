"use client";

import { CheckCircle2, ExternalLink, Gift, Loader2 } from "lucide-react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { DIVIDEND_DISTRIBUTOR_ABI } from "@/features/web3/lib/abis";
import { CONTRACTS, explorerTxUrl } from "@/features/web3/lib/contracts";
import { usePendingDividends } from "@/features/invest/hooks/use-dividends";
import { useSession } from "@/providers/session-provider";
import { formatCurrency, formatCompactAddress } from "@/shared/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Card de dividendos pendientes + botón de claim.
 *
 * <p>Lee {@code DividendDistributor.pendingDividends(wallet)} via el backend
 * ({@code GET /api/dividends/pending}). El backend a su vez hace
 * {@code eth_call} (no gasta gas) y devuelve el monto en USDC.
 *
 * <p>El botón "Reclamar" firma {@code DistributorContract.claimDividends()}
 * con MetaMask — eso sí ejecuta una tx on-chain.
 */
export function ClaimDividendsCard() {
  const { user } = useSession();
  const { address: connectedAddress, isConnected } = useAccount();
  const queryClient = useQueryClient();

  const linked = user?.walletAddress ?? null;
  const wallet = linked ?? connectedAddress ?? null;
  const sameAccount =
    linked && isConnected && connectedAddress?.toLowerCase() === linked.toLowerCase();

  const pending = usePendingDividends(wallet);
  const pendingUsdc = pending.data?.pendingUsdc ?? "0";
  const hasSomething = Number(pendingUsdc) > 0;

  const { writeContract, data: txHash, isPending, reset } = useWriteContract();
  const { isLoading: txConfirming, isSuccess: txConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  if (txConfirmed && txHash) {
    void pending.refetch();
    void queryClient.invalidateQueries({ queryKey: ["dividends"] });
  }

  function handleClaim() {
    writeContract({
      address: CONTRACTS.dividendDistributor,
      abi: DIVIDEND_DISTRIBUTOR_ABI,
      functionName: "claimDividends",
      args: [],
    });
  }

  return (
    <Card
      title="Dividendos on-chain"
      description="Reclamá tus dividendos directamente desde el DividendDistributor."
      actions={
        wallet ? (
          <Badge tone={hasSomething ? "success" : "neutral"}>
            {hasSomething ? "Disponibles" : "Sin pendientes"}
          </Badge>
        ) : null
      }
    >
      {!wallet ? (
        <p className="text-sm text-muted-foreground">
          Conectá una wallet para ver tus dividendos pendientes.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Pendiente de reclamar
              </p>
              <p className="text-xs text-muted-foreground">
                wallet {formatCompactAddress(wallet)}
              </p>
            </div>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {pending.isFetching ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>{formatCurrency(pendingUsdc)} <span className="text-base font-medium text-muted-foreground">USDC</span></>
              )}
            </p>
          </div>

          {linked && !sameAccount && (
            <p className="text-xs text-yellow-600">
              Conectaste una wallet distinta a la vinculada. El claim solo afecta a la wallet
              conectada en MetaMask ahora mismo.
            </p>
          )}

          <Button
            onClick={handleClaim}
            disabled={
              !isConnected ||
              isPending ||
              txConfirming ||
              !hasSomething
            }
            className="w-full gap-2"
            size="lg"
          >
            {isPending || txConfirming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Gift className="h-4 w-4" />
            )}
            {isPending
              ? "Firmá el claim en MetaMask…"
              : txConfirming
              ? "Confirmando…"
              : `Reclamar ${formatCurrency(pendingUsdc)}`}
          </Button>

          {txHash && (
            <a
              href={explorerTxUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-3 w-3" />
              {txConfirmed ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  <span>Reclamado · {txHash.slice(0, 10)}…</span>
                </>
              ) : (
                <span>Pendiente · {txHash.slice(0, 10)}…</span>
              )}
            </a>
          )}

          {txConfirmed && (
            <Button variant="ghost" size="sm" onClick={() => reset()} className="w-full">
              Limpiar último claim
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
