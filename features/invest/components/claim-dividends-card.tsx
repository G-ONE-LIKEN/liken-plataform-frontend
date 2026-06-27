"use client";

import { useEffect } from "react";
import { CheckCircle2, ExternalLink, Gift, Loader2 } from "lucide-react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DIVIDEND_DISTRIBUTOR_ABI } from "@/features/web3/lib/abis";
import { CONTRACTS, explorerTxUrl } from "@/features/web3/lib/contracts";
import { usePendingDividends } from "@/features/invest/hooks/use-dividends";
import { useSession } from "@/providers/session-provider";
import { formatCurrency, formatCompactAddress } from "@/shared/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Card de dividendos pendientes + boton de claim.
 *
 * Lee {@code DividendDistributor.pendingDividends(wallet)} via el backend
 * ({@code GET /api/dividends/pending}). El backend hace {@code eth_call}
 * read-only y devuelve el monto en USDC.
 *
 * El boton "Reclamar" firma {@code claimDividends()} con MetaMask.
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

  useEffect(() => {
    if (txConfirmed && txHash) {
      void pending.refetch();
      void queryClient.invalidateQueries({ queryKey: ["dividends"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txConfirmed, txHash, queryClient]);

  function handleClaim() {
    writeContract({
      address: CONTRACTS.dividendDistributor,
      abi: DIVIDEND_DISTRIBUTOR_ABI,
      functionName: "claimDividends",
      args: [],
    });
  }

  return (
    <Card className="h-full overflow-hidden bg-card">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Dividendos pendientes en contrato</p>
                <p className="text-xs text-muted-foreground">Saldo pendiente de reclamar en el DividendDistributor. Si hay fondos, el retiro requiere tu firma on-chain.</p>
              </div>
            </div>
            {wallet ? (
              <Badge tone={hasSomething ? "success" : "neutral"}>
                {hasSomething ? "Disponibles" : "Sin pendientes"}
              </Badge>
            ) : null}
          </div>

          <div className="mt-5">
            {!wallet ? (
              <p className="text-sm text-muted-foreground">
                Conecta una wallet para ver tus dividendos pendientes.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-primary/25 bg-[linear-gradient(135deg,rgba(31,132,140,0.10),rgba(31,132,140,0.04))] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Pendiente de reclamar
                      </p>
                      <div className="flex min-h-10 items-center">
                        {pending.isFetching ? (
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        ) : (
                          <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {formatCurrency(pendingUsdc)}{" "}
                            <span className="text-base font-medium text-muted-foreground">
                              USDC
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-background/40 px-3 py-2 text-right">
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Wallet vinculada
                      </p>
                      <p className="mt-1 font-medium text-foreground">
                        {formatCompactAddress(wallet)}
                      </p>
                    </div>
                  </div>
                </div>

                {linked && !sameAccount && (
                  <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-600">
                    Conectaste una wallet distinta a la vinculada. Cambia la cuenta
                    activa en MetaMask para reclamar: el monto pendiente que ves
                    corresponde a la wallet vinculada, no a la conectada.
                  </div>
                )}

                <Button
                  onClick={handleClaim}
                  disabled={
                    !isConnected ||
                    isPending ||
                    txConfirming ||
                    !hasSomething ||
                    Boolean(linked && !sameAccount)
                  }
                  className="w-full gap-2 sm:w-auto"
                  size="lg"
                >
                  {isPending || txConfirming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Gift className="h-4 w-4" />
                  )}
                  {isPending
                    ? "Firma el claim en MetaMask..."
                    : txConfirming
                      ? "Confirmando..."
                      : `Reclamar ${formatCurrency(pendingUsdc)}`}
                </Button>

                {txHash && (
                  <a
                    href={explorerTxUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {txConfirmed ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        <span>Reclamado · {txHash.slice(0, 10)}...</span>
                      </>
                    ) : (
                      <span>Pendiente · {txHash.slice(0, 10)}...</span>
                    )}
                  </a>
                )}

                {txConfirmed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => reset()}
                    className="w-full sm:w-auto"
                  >
                    Limpiar ultimo claim
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
