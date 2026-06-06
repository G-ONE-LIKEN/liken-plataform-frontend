"use client";

import { ArrowUpRight, ExternalLink, TrendingUp } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyInvestments, useInvestmentTotal } from "@/features/invest/hooks/use-investments";
import { explorerTxUrl } from "@/features/web3/lib/contracts";
import { formatCurrency } from "@/shared/lib/utils";
import Link from "next/link";

/**
 * Historial de compras primarias del usuario + sumario de tier.
 */
export function InvestmentHistory() {
  const investments = useMyInvestments(0, 10);
  const total = useInvestmentTotal();

  return (
    <Card
      title="Mis inversiones"
      description="Historial de compras primarias de LKN registradas on-chain."
      actions={
        total.data ? (
          <Badge tone={total.data.currentTier === "GOLD" ? "warning" : total.data.currentTier === "SILVER" ? "neutral" : "neutral"}>
            <TrendingUp className="mr-1 inline h-3 w-3" />
            {total.data.currentTier}
          </Badge>
        ) : null
      }
    >
      <div className="space-y-4">
        {total.isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total invertido
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {formatCurrency(total.data?.totalUsdcInvested ?? "0")}{" "}
              <span className="text-base font-medium text-muted-foreground">USDC</span>
            </p>
          </div>
        )}

        {investments.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : investments.data && investments.data.content.length > 0 ? (
          <ul className="divide-y divide-border">
            {investments.data.content.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/projects/${inv.projectId}`}
                    className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary"
                  >
                    Proyecto #{inv.projectId}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {new Date(inv.createdAt).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {Number(inv.lknAmount).toLocaleString("es-AR", { maximumFractionDigits: 4 })} LKN
                  </p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(inv.usdcAmount)}</p>
                </div>
                <a
                  href={explorerTxUrl(inv.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition hover:text-primary"
                  title={inv.txHash}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
            Todavía no hiciste compras primarias.
          </p>
        )}
      </div>
    </Card>
  );
}
