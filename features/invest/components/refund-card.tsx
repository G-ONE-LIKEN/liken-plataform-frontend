"use client";

import { CheckCircle2, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/shared/ui/badge";
import { OFFERING_CONTRACT_ABI } from "@/features/web3/lib/abis";
import { explorerTxUrl, TOKEN_DECIMALS } from "@/features/web3/lib/contracts";
import { formatCurrency } from "@/shared/lib/utils";
import { formatUnits } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import type { ProjectSummary } from "@/features/projects/types/projects";

/**
 * Card visible cuando la ronda primaria falló ({@code roundState === "FAILED"})
 * y el usuario tiene contribuciones a recuperar.
 *
 * <p>El backend no participa: el inversor firma directamente
 * {@code OfferingContract.refund()} con MetaMask y el contrato transfiere
 * el USDC desde el treasury de vuelta al inversor.
 */
export function RefundCard({ project }: { project: ProjectSummary }) {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const offering = project.offeringContractAddress as `0x${string}` | null;

  const eligibleByState = project.roundState === "FAILED";

  const { data: contribution, refetch: refetchContribution } = useReadContract({
    address: offering ?? undefined,
    abi: OFFERING_CONTRACT_ABI,
    functionName: "contributions",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(offering && address && eligibleByState) },
  });

  const contributionRaw = (typeof contribution === "bigint" ? contribution : 0n);
  const contributionUsdc = formatUnits(contributionRaw, TOKEN_DECIMALS.USDC);
  const hasContribution = contributionRaw > 0n;

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: txConfirming, isSuccess: txConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  if (txConfirmed && txHash) {
    void refetchContribution();
    void queryClient.invalidateQueries({ queryKey: ["wallet"] });
  }

  // Si la ronda no falló o no hay contrato, no renderizamos nada.
  if (!eligibleByState || !offering) return null;

  function handleRefund() {
    if (!offering) return;
    writeContract({
      address: offering,
      abi: OFFERING_CONTRACT_ABI,
      functionName: "refund",
      args: [],
    });
  }

  return (
    <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/20">
          <RefreshCw className="h-5 w-5 text-yellow-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-foreground">Refund disponible</h3>
            <Badge tone="warning">Ronda fallida</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            La ronda no alcanzó el soft cap antes del deadline. Reclamá tu USDC
            firmando una transacción con MetaMask.
          </p>

          {isConnected ? (
            hasContribution ? (
              <>
                <p className="mt-3 text-sm text-foreground">
                  Tu contribución on-chain:{" "}
                  <span className="font-semibold">{formatCurrency(contributionUsdc)} USDC</span>
                </p>
                <Button
                  onClick={handleRefund}
                  disabled={isPending || txConfirming}
                  className="mt-3 w-full gap-2"
                  size="sm"
                  variant="outline"
                >
                  {isPending || txConfirming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isPending
                    ? "Firmá el refund en MetaMask…"
                    : txConfirming
                    ? "Confirmando refund…"
                    : `Reclamar ${formatCurrency(contributionUsdc)} USDC`}
                </Button>

                {txHash && (
                  <a
                    href={explorerTxUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {txConfirmed ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        <span>Refund confirmado · {txHash.slice(0, 10)}…</span>
                      </>
                    ) : (
                      <span>{txHash.slice(0, 10)}…</span>
                    )}
                  </a>
                )}
              </>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                Esta wallet no tiene contribuciones registradas para esta ronda.
              </p>
            )
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              Conectá la wallet con la que invertiste para reclamar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
