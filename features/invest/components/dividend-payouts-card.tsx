"use client";

import { ExternalLink, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyDividendPayouts } from "@/features/invest/hooks/use-dividend-payouts";
import { explorerTxUrl } from "@/features/web3/lib/contracts";
import { formatCurrency } from "@/shared/lib/utils";

/**
 * Card de pagos de dividendos automaticos (flujo nuevo — transfer directo USDC
 * desde el signer admin). El holder NO firma nada: los USDC llegan solos a su
 * MetaMask cuando el oracle dispara un batch para el proyecto.
 */
export function DividendPayoutsCard() {
  const payouts = useMyDividendPayouts(0, 20);
  const items = payouts.data?.content ?? [];
  const totalReceived = items.reduce(
    (sum, p) => sum + Number(p.amount || "0"),
    0
  );

  return (
    <Card
      title="Dividendos recibidos"
      description="Pagos automaticos por la energia generada por los parques en los que invertiste. Los USDC llegan a tu wallet sin que tengas que firmar nada."
      actions={
        items.length > 0 ? (
          <Badge tone="success">{items.length} pagos</Badge>
        ) : null
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total recibido (mostrado)
            </p>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-1 text-3xl font-bold text-foreground">
            {payouts.isFetching ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <>
                {formatCurrency(totalReceived.toFixed(6))}{" "}
                <span className="text-base font-medium text-muted-foreground">
                  USDC
                </span>
              </>
            )}
          </div>
        </div>

        {payouts.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : items.length > 0 ? (
          <ul className="divide-y divide-border">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(p.amount)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        proyecto #{p.projectId}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.paidAt).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {p.txHash && (
                  <a
                    href={explorerTxUrl(p.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-500"
                    title={p.txHash}
                  >
                    <ExternalLink className="h-3 w-3" />
                    {p.txHash.slice(0, 10)}…
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
            Todavia no recibiste pagos. Aparecen apenas el oracle dispara un
            batch del parque en el que invertiste.
          </p>
        )}
      </div>
    </Card>
  );
}
