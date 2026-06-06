"use client"

import { useState } from "react"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Gift,
  Link2,
} from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Web3Provider } from "@/features/web3/components/web3-provider"
import { WalletStatusCard } from "@/features/web3/components/wallet-status-card"
import { ERC20_ABI } from "@/features/web3/lib/abis"
import { useWallet, useWalletMovements, useDeposit, useWithdraw } from "@/features/wallet/hooks/use-wallet"
import { ClaimDividendsCard } from "@/features/invest/components/claim-dividends-card"
import { InvestmentHistory } from "@/features/invest/components/investment-history"
import { DividendHistory } from "@/features/invest/components/dividend-history"
import { env } from "@/shared/config/env"
import type { MovementType } from "@/features/wallet/types/wallet"

function TokenBalanceRow({
  symbol,
  name,
  icon: Icon,
  address,
  decimals,
}: {
  symbol: string
  name: string
  icon: React.ElementType
  address: string
  decimals: number
}) {
  const { address: userAddress, isConnected } = useAccount()
  const isValidAddress = address && address !== "0x0000000000000000000000000000000000000000"

  const { data: balance, isLoading } = useReadContract({
    address: address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: isConnected && !!userAddress && isValidAddress },
  })

  const formatted = balance !== undefined
    ? Number(formatUnits(balance, decimals)).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      })
    : null

  return (
    <div className="flex items-center justify-between rounded-xl border border-transparent bg-secondary/50 p-4 transition-colors hover:border-primary/30">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/12">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{symbol}</p>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
      </div>
      <div className="text-right">
        {!isConnected ? (
          <p className="text-sm text-muted-foreground">Conectá tu wallet</p>
        ) : !isValidAddress ? (
          <p className="text-sm text-muted-foreground">Próximamente</p>
        ) : isLoading ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <p className="font-semibold text-foreground">{formatted} {symbol}</p>
        )}
      </div>
    </div>
  )
}

const MOVEMENT_CONFIG: Record<MovementType, { label: string; icon: React.ElementType; positive: boolean }> = {
  DEPOSIT: { label: "Depósito", icon: ArrowDownLeft, positive: true },
  WITHDRAWAL: { label: "Retiro", icon: ArrowUpRight, positive: false },
  DIVIDEND: { label: "Dividendo on-chain", icon: Gift, positive: true },
  TOKEN_PURCHASE: { label: "Compra de LKN", icon: TrendingDown, positive: false },
  // Devolución de USDC por soft cap missed (OfferingContract.refund).
  REFUND: { label: "Refund de ronda", icon: RefreshCw, positive: true },
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
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.72_0.16_165)]" />
          Wallet
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mi Wallet</h1>
        <p className="mt-1 text-muted-foreground">Tus fondos en el sistema y tu conexión blockchain</p>
      </div>

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

      {/* ── Sección 1: Sistema (Web2 ledger) ────────────────────── */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Wallet className="h-4 w-4" /> Cuenta en el sistema
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-background lg:col-span-2">
            <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(circle, oklch(0.80 0.12 85 / 0.30), transparent 70%)" }}
            />
            <CardContent className="relative p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_-6px_oklch(0.72_0.16_165/0.85)]">
                  <Wallet className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance disponible ({wallet?.currency ?? "USD"})</p>
                  {walletQuery.isLoading ? (
                    <Skeleton className="mt-1 h-10 w-36" />
                  ) : (
                    <p className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent">{formatBalance(wallet?.balance)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader><CardTitle>Mover Fondos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="deposit">
                <TabsList className="w-full bg-secondary">
                  <TabsTrigger value="deposit" className="flex-1">Depositar</TabsTrigger>
                  <TabsTrigger value="withdraw" className="flex-1">Retirar</TabsTrigger>
                </TabsList>
                <TabsContent value="deposit" className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Monto (USD)</label>
                    <Input type="number" placeholder="0.00" value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)} min="0.01" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["100", "250", "500", "1000"].map((v) => (
                      <Button key={v} variant="outline" size="sm" onClick={() => setDepositAmount(v)}>
                        ${v === "1000" ? "1K" : v}
                      </Button>
                    ))}
                  </div>
                  <Button className="w-full gap-2" onClick={handleDeposit} disabled={deposit.isPending}>
                    {deposit.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowDownLeft className="h-4 w-4" />}
                    Depositar
                  </Button>
                </TabsContent>
                <TabsContent value="withdraw" className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Monto (USD)</label>
                    <Input type="number" placeholder="0.00" value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)} min="0.01" />
                  </div>
                  <p className="text-xs text-muted-foreground">Disponible: {formatBalance(wallet?.balance)}</p>
                  <Button variant="outline" className="w-full gap-2" onClick={handleWithdraw} disabled={withdraw.isPending}>
                    {withdraw.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
                    Retirar
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Sección 2: Blockchain (MetaMask) ────────────────────── */}
      <Web3Provider>
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Link2 className="h-4 w-4" /> Wallet blockchain
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <WalletStatusCard />
            <Card className="bg-card">
              <CardHeader><CardTitle>Tokens On-Chain</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <TokenBalanceRow
                    symbol="USDC"
                    name="USD Coin (Sepolia)"
                    icon={DollarSign}
                    address={env.usdcAddress}
                    decimals={6}
                  />
                  <TokenBalanceRow
                    symbol="LKN"
                    name="LIKEN Token"
                    icon={Zap}
                    address={env.lknAddress ?? "0x0000000000000000000000000000000000000000"}
                    decimals={18}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Sección 3: Inversiones + dividendos on-chain ─────────── */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Gift className="h-4 w-4" /> Inversiones y dividendos
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <ClaimDividendsCard />
            <InvestmentHistory />
          </div>
          <div className="mt-6">
            <DividendHistory />
          </div>
        </div>
      </Web3Provider>

      {/* ── Sección 4: Historial ─────────────────────────────────── */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <TrendingUp className="h-4 w-4" /> Historial de movimientos
        </h2>
        <Card className="bg-card">
          <CardContent className="pt-6">
            {movementsQuery.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
              </div>
            ) : movements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <DollarSign className="mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm font-medium text-foreground">Sin movimientos aún</p>
                <p className="mt-1 text-xs">Los movimientos del sistema y de blockchain aparecerán acá.</p>
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
      </div>
    </div>
  )
}
