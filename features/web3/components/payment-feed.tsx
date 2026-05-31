"use client"

import { useState } from "react"
import { useWatchContractEvent } from "wagmi"
import { formatUnits } from "viem"
import { PAYGW_ABI } from "@/features/web3/lib/abis"
import { env } from "@/shared/config/env"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"

const PAYGW = env.paymentGatewayAddress as `0x${string}`

type PaidLog = {
  payer: string
  amount: bigint
  action: string
  tx: string
}

type PaidEvent = {
  args: {
    payer: string
    amount: bigint
    action: string
  }
  transactionHash: string
}

export function PaymentFeed() {
  const [logs, setLogs] = useState<PaidLog[]>([])

  useWatchContractEvent({
    address: PAYGW,
    abi: PAYGW_ABI,
    eventName: "Paid",
    onLogs(events: PaidEvent[]) {
      const next = events.map((e) => ({
        payer: e.args.payer,
        amount: e.args.amount,
        action: e.args.action,
        tx: e.transactionHash,
      }))
      setLogs((prev) => [...next, ...prev].slice(0, 20))
    },
  })

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Pagos en vivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Esperando eventos <code className="text-xs">Paid</code>…
          </p>
        ) : (
          <ul className="space-y-2">
            {logs.map((l) => (
              <li key={l.tx} className="rounded-lg bg-secondary/50 px-3 py-2 font-mono text-xs">
                <a
                  href={`https://sepolia.etherscan.io/tx/${l.tx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {l.payer.slice(0, 8)}… → {formatUnits(l.amount, 6)} USDC
                  <span className="ml-2 text-muted-foreground">({l.action.slice(0, 10)}…)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
