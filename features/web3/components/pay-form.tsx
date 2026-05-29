"use client"

import { useState } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits, keccak256, toHex } from "viem"
import { PAYGW_ABI, ERC20_ABI } from "@/features/web3/lib/abis"
import { env } from "@/shared/config/env"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, CheckCircle2 } from "lucide-react"

const PAYGW = env.paymentGatewayAddress as `0x${string}`
const USDC = env.usdcAddress as `0x${string}`

export function PayForm() {
  const { address } = useAccount()
  const [amount, setAmount] = useState("1")
  const [action, setAction] = useState("LIKEN_INVEST")

  const amountWei = parseUnits(amount || "0", 6)
  const actionBytes = keccak256(toHex(action))

  const { data: balance } = useReadContract({
    address: USDC,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  })

  const { data: allowance } = useReadContract({
    address: USDC,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, PAYGW] : undefined,
  })

  const needsApprove = (allowance ?? 0n) < amountWei

  const { writeContract: writeApprove, data: approveHash, isPending: approvePending } = useWriteContract()
  const { writeContract: writePay, data: payHash, isPending: payPending } = useWriteContract()

  const { isLoading: approveConfirming, isSuccess: approveDone } = useWaitForTransactionReceipt({ hash: approveHash })
  const { isLoading: payConfirming, isSuccess: payDone } = useWaitForTransactionReceipt({ hash: payHash })

  function handleApprove() {
    writeApprove({ address: USDC, abi: ERC20_ABI, functionName: "approve", args: [PAYGW, amountWei] })
  }

  function handlePay() {
    writePay({ address: PAYGW, abi: PAYGW_ABI, functionName: "pay", args: [amountWei, actionBytes] })
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Pagar con USDC</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Balance: <span className="font-semibold text-foreground">{balance ? (Number(balance) / 1e6).toFixed(2) : "0"} USDC</span>
        </p>

        <div className="space-y-2">
          <Label>Monto (USDC)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label>Acción</Label>
          <Input
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="ej. LIKEN_INVEST"
          />
        </div>

        {needsApprove ? (
          <Button
            onClick={handleApprove}
            disabled={approvePending || approveConfirming}
            className="w-full"
          >
            {approvePending
              ? "Confirmá en wallet…"
              : approveConfirming
              ? "Esperando bloque…"
              : `1) Aprobar ${amount} USDC`}
          </Button>
        ) : (
          <Button
            onClick={handlePay}
            disabled={payPending || payConfirming}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {payPending
              ? "Confirmá en wallet…"
              : payConfirming
              ? "Esperando bloque…"
              : `2) Pagar ${amount} USDC`}
          </Button>
        )}

        {approveHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${approveHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-3 w-3" />
            approve: {approveHash.slice(0, 10)}…
          </a>
        )}
        {payHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${payHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-3 w-3" />
            pay: {payHash.slice(0, 10)}…
          </a>
        )}
        {payDone && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            Pago confirmado en la blockchain
          </div>
        )}
      </CardContent>
    </Card>
  )
}
