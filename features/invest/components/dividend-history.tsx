"use client";

import { ExternalLink, Gift } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyDividends } from "@/features/invest/hooks/use-dividends";
import { explorerTxUrl } from "@/features/web3/lib/contracts";
import { formatCurrency } from "@/shared/lib/utils";

/**
 * Historial de claims ejecutados sobre el DividendDistributor.
 */
export function DividendHistory() {
  const claims = useMyDividends(0, 10);

  return (
    <Card
      title="Historial de claims"
      description="Cada reclamo ejecutado sobre el DividendDistributor queda registrado aqui."
    >
      {claims.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : claims.data && claims.data.content.length > 0 ? (
        <ul className="divide-y divide-border">
          {claims.data.content.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Gift className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{formatCurrency(c.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <a
                href={explorerTxUrl(c.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                title={c.txHash}
              >
                <ExternalLink className="h-3 w-3" />
                {c.txHash.slice(0, 10)}...
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
          Todavia no ejecutaste claims.
        </p>
      )}
    </Card>
  );
}
