"use client"

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { ONRAMP_ABI } from "@/features/web3/lib/abis"
import { env } from "@/shared/config/env"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, ExternalLink, CheckCircle2 } from "lucide-react"

const ONRAMP = env.onrampAddress as `0x${string}`

type Step = "idle" | "card" | "tx" | "done"

export function CardOnramp() {
  const [step, setStep] = useState<Step>("idle")

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  if (isSuccess && step !== "done") setStep("done")

  async function buy50USDC() {
    setStep("card")
    await new Promise((r) => setTimeout(r, 1500))
    setStep("tx")
    writeContract({
      address: ONRAMP,
      abi: ONRAMP_ABI,
      functionName: "buyWithCard",
      value: parseEther("0.05"),
    })
  }

  return (
    <Card className="border-primary/30 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Comprar USDC con tarjeta
        </CardTitle>
        <CardDescription>
          Simulado — en producción esto sería MoonPay o Lemon Cash
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={buy50USDC}
          disabled={step !== "idle" && step !== "done"}
          className="w-full"
          variant={step === "done" ? "outline" : "default"}
        >
          {step === "idle" && "Comprar 50 mUSDC con tarjeta"}
          {step === "card" && "Procesando tarjeta…"}
          {step === "tx" && (isPending ? "Confirmá en wallet…" : isLoading ? "Esperando bloque…" : "Procesando…")}
          {step === "done" && "✓ 50 mUSDC en tu wallet"}
        </Button>

        {hash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-3 w-3" />
            tx: {hash.slice(0, 10)}…
          </a>
        )}

        {step === "done" && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            50 mUSDC recibidos. Ya podés usar Approve → Pay.
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Envía 0.05 ETH testnet al contrato onramp y recibís 50 mUSDC.
          Tasa: 1 ETH = 1000 mUSDC.
        </p>
      </CardContent>
    </Card>
  )
}
