"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Info,
  Loader2,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/shared/ui/badge";
import { ERC20_ABI, OFFERING_CONTRACT_ABI } from "@/features/web3/lib/abis";
import { CONTRACTS, TOKEN_DECIMALS, explorerTxUrl } from "@/features/web3/lib/contracts";
import { usePreviewInvestment } from "@/features/invest/hooks/use-investments";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/providers/session-provider";
import { formatCurrency } from "@/shared/lib/utils";
import type { ProjectSummary } from "@/features/projects/types/projects";

/**
 * Flujo de compra primaria de LKN.
 *
 * <p>Pasos:
 * <ol>
 *   <li>El usuario ingresa USDC. El backend devuelve el preview (LKN
 *       equivalentes + flag {@code canInvest}).</li>
 *   <li>Gates: KYC aprobado, wallet vinculada y conectada, address matchea,
 *       proyecto con {@code offeringContractAddress} desplegado.</li>
 *   <li>Si la allowance USDC al OfferingContract es menor al monto, el botón
 *       primero pide {@code approve(usdcAmount)}.</li>
 *   <li>Cuando hay allowance suficiente, el botón ejecuta {@code buy(usdcAmount)}.</li>
 *   <li>Mientras la tx se confirma, se muestra el hash con link a Etherscan.</li>
 * </ol>
 */
export function BuyLknFlow({ project }: { project: ProjectSummary }) {
  const { user } = useSession();
  const { address: connectedAddress, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const [usdcInput, setUsdcInput] = useState("");

  // ── Gates de elegibilidad ────────────────────────────────────────────────
  const linkedAddress = user?.walletAddress ?? null;
  const hasLinkedWallet = Boolean(linkedAddress);
  const sameAccount =
    hasLinkedWallet &&
    isConnected &&
    connectedAddress?.toLowerCase() === linkedAddress?.toLowerCase();
  const offering = project.offeringContractAddress as `0x${string}` | null;
  const hasOnchainContract = Boolean(offering);
  const canInvestStateWise =
    project.state === "PRE_OPEN" || project.state === "OPEN";

  // ── Preview backend ──────────────────────────────────────────────────────
  const preview = usePreviewInvestment(
    canInvestStateWise && hasOnchainContract ? project.id : null,
    usdcInput
  );

  // ── Allowance USDC ──────────────────────────────────────────────────────
  const usdcAmountRaw = useMemo(() => {
    try {
      if (!usdcInput || Number(usdcInput) <= 0) return 0n;
      return parseUnits(usdcInput, TOKEN_DECIMALS.USDC);
    } catch {
      return 0n;
    }
  }, [usdcInput]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.usdc,
    abi: ERC20_ABI,
    functionName: "allowance",
    args:
      connectedAddress && offering
        ? [connectedAddress, offering]
        : undefined,
    query: { enabled: Boolean(connectedAddress && offering) },
  });

  const needsApprove =
    usdcAmountRaw > 0n &&
    (typeof allowance === "bigint" ? allowance : 0n) < usdcAmountRaw;

  // ── Escritura on-chain ──────────────────────────────────────────────────
  const { writeContract, data: txHash, isPending, reset } = useWriteContract();
  const { isLoading: txConfirming, isSuccess: txConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  function handleApprove() {
    if (!offering || usdcAmountRaw === 0n) return;
    writeContract({
      address: CONTRACTS.usdc,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [offering, usdcAmountRaw],
    });
  }

  function handleBuy() {
    if (!offering || usdcAmountRaw === 0n) return;
    writeContract({
      address: offering,
      abi: OFFERING_CONTRACT_ABI,
      functionName: "buy",
      args: [usdcAmountRaw],
    });
  }

  // Cuando se confirma una tx (approve o buy), refrescar allowance y mis investments.
  if (txConfirmed && txHash) {
    queryClient.invalidateQueries({ queryKey: ["invest"] });
    void refetchAllowance();
  }

  // ── Render según gate ────────────────────────────────────────────────────
  if (!canInvestStateWise) {
    return (
      <GateMessage
        tone="warning"
        title="Inversiones no disponibles"
        description={`El proyecto está en estado ${project.state}.`}
      />
    );
  }
  if (!hasOnchainContract) {
    return (
      <GateMessage
        tone="warning"
        title="Sin contrato desplegado"
        description="Este proyecto aún no tiene un OfferingContract desplegado. La inversión se habilita una vez que se complete el deploy on-chain."
      />
    );
  }
  if (user?.kycStatus && user.kycStatus !== "APPROVED") {
    return (
      <GateMessage
        tone="danger"
        title="KYC pendiente"
        description="Para invertir necesitás tener tu KYC aprobado."
      />
    );
  }
  if (!isConnected) {
    return (
      <GateMessage
        tone="neutral"
        title="Conectá tu wallet"
        description="Para invertir tenés que conectar tu wallet (MetaMask) primero."
      />
    );
  }
  if (!hasLinkedWallet) {
    return (
      <GateMessage
        tone="warning"
        title="Wallet sin vincular"
        description="Tu wallet conectada todavía no está vinculada a tu cuenta Liken. Hacelo desde Wallet → Vincular wallet."
      />
    );
  }
  if (!sameAccount) {
    return (
      <GateMessage
        tone="danger"
        title="Cuenta de MetaMask distinta"
        description="Tu cuenta Liken está vinculada a otra dirección. Cambiá la cuenta activa en MetaMask para operar."
      />
    );
  }

  // ── Estado feliz: render del flow ────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Input USDC */}
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Monto a invertir (USDC)
        </label>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder={project.minimumInvestment || "100"}
          value={usdcInput}
          onChange={(e) => {
            setUsdcInput(e.target.value);
            // Cuando el usuario cambia el monto, descartar el último hash mostrado
            // para no confundir (la tx anterior puede haber sido por otro amount).
            if (txHash) reset();
          }}
          className="mt-1.5 text-lg font-semibold"
        />
      </div>

      {/* Preview del backend */}
      {preview.isFetching && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Calculando preview…
        </div>
      )}

      {preview.data && preview.data.canInvest && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recibís
            </p>
            <p className="text-xs text-muted-foreground">
              al precio vigente {formatCurrency(preview.data.currentPrice)}/LKN
            </p>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {Number(preview.data.lknAmount).toLocaleString("es-AR", {
              maximumFractionDigits: 4,
            })}{" "}
            <span className="text-base font-medium text-muted-foreground">LKN</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Por {formatCurrency(preview.data.usdcAmount)} USDC.
          </p>
        </div>
      )}

      {preview.data && !preview.data.canInvest && (
        <GateMessage
          tone="danger"
          title="No se puede invertir"
          description={preview.data.reason ?? "Estado del proyecto no permitido."}
        />
      )}

      {/* CTA: approve → buy */}
      <div className="space-y-2">
        {needsApprove ? (
          <Button
            onClick={handleApprove}
            disabled={
              isPending ||
              txConfirming ||
              usdcAmountRaw === 0n ||
              !preview.data?.canInvest
            }
            className="w-full gap-2"
            size="lg"
          >
            {isPending || txConfirming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            {isPending
              ? "Firmá la aprobación en MetaMask…"
              : txConfirming
              ? "Confirmando aprobación…"
              : `Aprobar ${usdcInput || "0"} USDC`}
          </Button>
        ) : (
          <Button
            onClick={handleBuy}
            disabled={
              isPending ||
              txConfirming ||
              usdcAmountRaw === 0n ||
              !preview.data?.canInvest
            }
            className="w-full gap-2"
            size="lg"
          >
            {isPending || txConfirming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {isPending
              ? "Firmá la compra en MetaMask…"
              : txConfirming
              ? "Confirmando compra…"
              : `Comprar LKN`}
          </Button>
        )}

        {/* Hash + estado de la última tx */}
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
                <span>Confirmada · {txHash.slice(0, 10)}…</span>
              </>
            ) : (
              <span>Pendiente · {txHash.slice(0, 10)}…</span>
            )}
          </a>
        )}
      </div>

      {needsApprove && preview.data?.canInvest && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3 w-3 shrink-0 text-primary/60" />
          <span>
            Tu allowance USDC al contrato no alcanza para este monto. Primero aprobás,
            después confirmás la compra (son dos transacciones).
          </span>
        </div>
      )}
    </div>
  );
}

function GateMessage({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: "danger" | "warning" | "neutral";
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        tone === "danger"
          ? "border-destructive/30 bg-destructive/5"
          : tone === "warning"
          ? "border-yellow-500/30 bg-yellow-500/10"
          : "border-border bg-secondary/30"
      }`}
    >
      <ShieldAlert
        className={`mt-0.5 h-4 w-4 shrink-0 ${
          tone === "danger"
            ? "text-destructive"
            : tone === "warning"
            ? "text-yellow-600"
            : "text-muted-foreground"
        }`}
      />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-1">
          <Badge tone={tone === "danger" ? "danger" : tone === "warning" ? "warning" : "neutral"}>
            {tone === "danger" ? "Bloqueado" : tone === "warning" ? "Aviso" : "Info"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
