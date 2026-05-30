"use client"

import { useState } from "react"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  DollarSign,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Web3Provider } from "@/features/web3/components/web3-provider"
import { WalletStatusCard } from "@/features/web3/components/wallet-status-card"
import { PayForm } from "@/features/web3/components/pay-form"
import { PaymentFeed } from "@/features/web3/components/payment-feed"
import { CardOnramp } from "@/features/web3/components/card-onramp"
import { useWallet, useWalletMovements, useDeposit, useWithdraw } from "@/features/wallet/hooks/use-wallet"
import { env } from "@/shared/config/env"
import type { MovementType } from "@/features/wallet/types/wallet"

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/50 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 break-all text-sm font-medium text-foreground">{value || "No configurado"}</div>
    </div>
  )
}

const MOVEMENT_CONFIG: Record<MovementType, { label: string; icon: React.ElementType; positive: boolean }> = {
  DEPOSIT: { label: "Depósito", icon: ArrowDownLeft, positive: true },
  WITHDRAWAL: { label: "Retiro", icon: ArrowUpRight, positive: false },
  DIVIDEND: { label: "Dividendo", icon: Gift, positive: true },
  TOKEN_PURCHASE: { label: "Compra de tokens", icon: TrendingDown, positive: false },
  P2P_SALE: { label: "Venta P2P", icon: TrendingUp, positive: true },
  P2P_PURCHASE: { label: "Compra P2P", icon: TrendingDown, positive: false },
}

function formatBalance(raw: string | undefined) {
  if (!raw) return "$0.00"
  const num = parseFloat(raw)
  return Number.isFinite(num)
    ? num.toLocaleString("es-AR", { style: "currency", currency: "USD" })
    : "$0.00"
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function WalletPage() {
  const walletQuery = useWallet()
  const movementsQuery = useWalletMovements()
  const deposit = useDeposit()
  const withdraw = useWithdraw()

  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const wallet = walletQuery.data
  const movements = movementsQuery.data?.content ?? []

  async function handleDeposit() {
    const amount = parseFloat(depositAmount)
    if (!amount || amount <= 0) { setActionError("Ingresá un monto válido."); return }
    setActionError(null)
    try {
      await deposit.mutateAsync({ amount, description: "Depósito desde dashboard" })
      setActionSuccess(`Depósito de $${amount.toFixed(2)} realizado correctamente.`)
      setDepositAmount("")
      setTimeout(() => setActionSuccess(null), 4000)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Error al depositar.")
    }
  }

  async function handleWithdraw() {
    const amount = parseFloat(withdrawAmount)
    if (!amount || amount <= 0) { setActionError("Ingresá un monto válido."); return }
    setActionError(null)
    try {
      await withdraw.mutateAsync({ amount, description: "Retiro desde dashboard" })
      setActionSuccess(`Retiro de $${amount.toFixed(2)} realizado correctamente.`)
      setWithdrawAmount("")
      setTimeout(() => setActionSuccess(null), 4000)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Error al retirar.")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mi Wallet</h1>
        <p className="mt-1 text-muted-foreground">Gestiona tus fondos, tokens y conexión blockchain</p>
      </div>

      {/* Feedback */}
      {actionError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
          {actionSuccess}
        </div>
      )}

      {/* Balance overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/20 to-background lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Wallet className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance Disponible ({wallet?.currency ?? "USD"})</p>
                {walletQuery.isLoading ? (
                  <Skeleton className="mt-1 h-10 w-36" />
                ) : (
                  <p className="text-4xl font-bold text-foreground">{formatBalance(wallet?.balance)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Depósito / Retiro */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Mover Fondos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="deposit">
              <TabsList className="w-full bg-secondary">
                <TabsTrigger value="deposit" className="flex-1">Depositar</TabsTrigger>
                <TabsTrigger value="withdraw" className="flex-1">Retirar</TabsTrigger>
              </TabsList>
              <TabsContent value="deposit" className="space-y-3 pt-2">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Monto (USD)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="0.01"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["100", "250", "500", "1000"].map((v) => (
                    <Button key={v} variant="outline" size="sm" onClick={() => setDepositAmount(v)}>
                      ${v === "1000" ? "1K" : v}
                    </Button>
                  ))}
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={handleDeposit}
                  disabled={deposit.isPending}
                >
                  {deposit.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowDownLeft className="h-4 w-4" />}
                  Depositar
                </Button>
              </TabsContent>
              <TabsContent value="withdraw" className="space-y-3 pt-2">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Monto (USD)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="0.01"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Disponible: {formatBalance(wallet?.balance)}
                </p>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleWithdraw}
                  disabled={withdraw.isPending}
                >
                  {withdraw.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
                  Retirar
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Web3 — conexión + onramp */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Web3Provider>
          <WalletStatusCard />
        </Web3Provider>
        <Web3Provider>
          <CardOnramp />
        </Web3Provider>
      </div>

      {/* Web3 — pago con USDC + feed en vivo */}
      <Web3Provider>
        <div className="grid gap-6 lg:grid-cols-2">
          <PayForm />
          <PaymentFeed />
        </div>
      </Web3Provider>

      {/* Historial de movimientos */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Historial de Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {movementsQuery.isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </div>
          ) : movements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <DollarSign className="mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm font-medium text-foreground">Sin movimientos aún</p>
              <p className="mt-1 text-xs">Realizá tu primer depósito para comenzar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {movements.map((m) => {
                const config = MOVEMENT_CONFIG[m.type] ?? MOVEMENT_CONFIG.DEPOSIT
                const Icon = config.icon
                return (
                  <div key={m.id} className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.positive ? "bg-green-500/10" : "bg-destructive/10"}`}>
                      <Icon className={`h-5 w-5 ${config.positive ? "text-green-500" : "text-destructive"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{config.label}</p>
                      <p className="text-xs text-muted-foreground">{m.description ?? formatDate(m.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${config.positive ? "text-green-500" : "text-destructive"}`}>
                        {config.positive ? "+" : "-"}${parseFloat(m.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Saldo: ${parseFloat(m.balanceAfter).toFixed(2)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tokens on-chain */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Tokens On-Chain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { token: "USDC", name: "USD Coin (Sepolia)", Icon: DollarSign },
              { token: "LKN", name: "LIKEN Token", Icon: Zap },
            ].map((item) => (
              <div key={item.token} className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <item.Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.token}</p>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Conectá tu wallet para ver el saldo</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Entorno blockchain (colapsado) */}
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          Configuración avanzada de red
        </summary>
        <Card className="mt-3 bg-card">
          <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
            <ConfigRow label="Chain ID" value={String(env.chainId)} />
            <ConfigRow label="PaymentGateway" value={env.paymentGatewayAddress} />
            <ConfigRow label="USDC" value={env.usdcAddress} />
            <ConfigRow label="Onramp" value={env.onrampAddress} />
          </CardContent>
        </Card>
      </details>
    </div>
  )
}
