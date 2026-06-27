"use client"

import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ClaimDividendsCard } from "@/features/invest/components/claim-dividends-card"
import { useMyOrders } from "@/features/marketplace/hooks/useOrderBook"
import { Web3Provider } from "@/features/web3/components/web3-provider"
import { WalletStatusCard } from "@/features/web3/components/wallet-status-card"
import { ERC20_ABI } from "@/features/web3/lib/abis"
import { useSession } from "@/providers/session-provider"
import { env } from "@/shared/config/env"
import { useMyHoldings, useWallet, useWalletMovements } from "@/features/wallet/hooks/use-wallet"
import type { MovementType } from "@/features/wallet/types/wallet"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const

function useTokenBalance(address: string | undefined, decimals: number, holderAddress: `0x${string}` | null) {
  const isValid = Boolean(address && address !== ZERO_ADDRESS)
  return useReadContract({
    address: address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: holderAddress ? [holderAddress] : undefined,
    query: {
      enabled: !!holderAddress && isValid,
      refetchInterval: 3000,
    },
  }) as ReturnType<typeof useReadContract> & { data?: bigint }
}

function toNumber(balance: bigint | undefined, decimals: number) {
  return balance !== undefined ? Number(formatUnits(balance, decimals)) : 0
}

function formatUsd(value: number) {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatTokens(value: number, maximumFractionDigits = 2) {
  return value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits })
}

const MOVEMENT_CONFIG: Record<MovementType, { label: string; icon: React.ElementType; positive: boolean }> = {
  DEPOSIT: { label: "Deposito", icon: ArrowDownLeft, positive: true },
  WITHDRAWAL: { label: "Retiro", icon: ArrowUpRight, positive: false },
  DIVIDEND: { label: "Dividendo on-chain", icon: DollarSign, positive: true },
  TOKEN_PURCHASE: { label: "Compra de LKN", icon: TrendingDown, positive: false },
  REFUND: { label: "Refund de ronda", icon: RefreshCw, positive: true },
  P2P_SALE: { label: "Venta P2P", icon: TrendingUp, positive: true },
  P2P_PURCHASE: { label: "Compra P2P", icon: TrendingDown, positive: false },
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

function BalanceCard({
  walletBalance,
  totalLkn,
  availableLkn,
  reservedLkn,
  holdingsLoading,
  walletLoading,
  holderAddress,
}: {
  walletBalance: string | undefined
  totalLkn: number
  availableLkn: number
  reservedLkn: number
  holdingsLoading: boolean
  walletLoading: boolean
  holderAddress: `0x${string}` | null
}) {
  const usdcOnchain = useTokenBalance(env.usdcAddress, 6, holderAddress)
  const lknOnchain = useTokenBalance(env.lknAddress ?? ZERO_ADDRESS, 18, holderAddress)

  const usdcSystem = walletBalance ? parseFloat(walletBalance) : 0
  const usdcOnchainValue = toNumber(usdcOnchain.data, 6)
  const lknOnchainValue = toNumber(lknOnchain.data, 18)
  const totalUsdc = usdcSystem + usdcOnchainValue
  const totalLknAll = totalLkn + lknOnchainValue

  const onchainLoading = usdcOnchain.isLoading || lknOnchain.isLoading
  const hasWallet = !!holderAddress

  return (
    <Card className="h-full overflow-hidden bg-card">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Balance total</p>
              <p className="text-xs text-muted-foreground">USDC del sistema + on-chain</p>
            </div>
          </div>
          <div className="mt-5">
            {walletLoading || onchainLoading ? (
              <Skeleton className="h-10 w-44" />
            ) : (
              <p className="text-4xl font-bold tracking-tight text-foreground">{formatUsd(totalUsdc)}</p>
            )}
          </div>
        </div>

        <div className="divide-y divide-border/60 border-t border-border/60">
          <Row
            icon={DollarSign}
            label="USDC en el sistema"
            value={walletLoading ? <Skeleton className="h-5 w-24" /> : formatUsd(usdcSystem)}
            sub="Fondos disponibles en el ledger"
          />
          <Row
            icon={DollarSign}
            label="USDC on-chain"
            value={!hasWallet ? <span className="text-sm text-muted-foreground">Sin wallet</span> : onchainLoading ? <Skeleton className="h-5 w-24" /> : formatUsd(usdcOnchainValue)}
            sub="Sepolia (MetaMask)"
          />
          <Row
            icon={Zap}
            label="LKN en el sistema"
            value={holdingsLoading ? <Skeleton className="h-5 w-28" /> : <>{formatTokens(totalLkn)} <span className="text-sm font-normal text-muted-foreground">LKN</span></>}
            sub={
              holdingsLoading ? undefined : (
                <span className="flex items-center gap-1.5">
                  <span className="font-medium text-green-500">{formatTokens(availableLkn)} disp.</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-medium text-orange-500">{formatTokens(reservedLkn)} reserv.</span>
                </span>
              )
            }
          />
          <Row
            icon={Zap}
            label="LKN on-chain"
            value={!hasWallet ? <span className="text-sm text-muted-foreground">Sin wallet</span> : onchainLoading ? <Skeleton className="h-5 w-28" /> : <>{formatTokens(lknOnchainValue, 4)} <span className="text-sm font-normal text-muted-foreground">LKN</span></>}
            sub="Sepolia (MetaMask)"
          />
          <Row
            icon={Zap}
            label="Total LKN"
            highlight
            value={holdingsLoading || onchainLoading ? <Skeleton className="h-5 w-28" /> : <>{formatTokens(totalLknAll, 4)} <span className="text-sm font-normal text-muted-foreground">LKN</span></>}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function Row({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  sub?: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className={`flex items-center justify-between gap-4 px-6 py-4 ${highlight ? "bg-secondary/30" : ""}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${highlight ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className={`text-sm ${highlight ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>{label}</p>
          {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
        </div>
      </div>
      <div className="text-right font-semibold text-foreground">{value}</div>
    </div>
  )
}

function MovementHistoryCard({
  isLoading,
  movements,
}: {
  isLoading: boolean
  movements: Array<{
    id: number
    type: MovementType
    amount: string
    balanceAfter: string
    description?: string | null
    createdAt: string
  }>
}) {
  return (
    <Card className="h-full max-h-[34rem] overflow-hidden bg-card">
      <CardContent className="flex h-full flex-col p-0">
        <div className="border-b border-border/60 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Historial de movimientos</p>
              <p className="text-xs text-muted-foreground">Actividad del sistema y blockchain en una sola vista</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </div>
          ) : movements.length === 0 ? (
            <div className="flex h-full min-h-56 flex-col items-center justify-center text-center text-muted-foreground">
              <DollarSign className="mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm font-medium text-foreground">Sin movimientos aun</p>
              <p className="mt-1 text-xs">Los movimientos del sistema y de blockchain apareceran aca.</p>
            </div>
          ) : (
            <div className="space-y-3 pr-1">
              {movements.map((m) => {
                const config = MOVEMENT_CONFIG[m.type] ?? MOVEMENT_CONFIG.DEPOSIT
                const Icon = config.icon
                return (
                  <div key={m.id} className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.positive ? "bg-green-500/10" : "bg-destructive/10"}`}>
                      <Icon className={`h-5 w-5 ${config.positive ? "text-green-500" : "text-destructive"}`} />
                    </div>
                    <div className="min-w-0 flex-1">
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
        </div>
      </CardContent>
    </Card>
  )
}

export default function WalletPage() {
  return (
    <Web3Provider>
      <WalletContent />
    </Web3Provider>
  )
}

function WalletContent() {
  const { user } = useSession()
  const { address: connectedAddress } = useAccount()
  const walletQuery = useWallet()
  const movementsQuery = useWalletMovements()
  const holdingsQuery = useMyHoldings()
  const ordersQuery = useMyOrders()

  const movements = movementsQuery.data?.content ?? []

  const totalLkn = holdingsQuery.data?.reduce((sum, h) => sum + h.tokensAmount, 0) || 0
  const reservedLkn = ordersQuery.data?.filter((o) => o.status === "OPEN" || o.status === "PENDING_SETTLEMENT")
    .reduce((sum, o) => sum + o.tokensAmount, 0) || 0
  const availableLkn = totalLkn - reservedLkn

  const holderAddress = (user?.walletAddress ?? connectedAddress ?? null) as `0x${string}` | null

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.72_0.16_165)]" />
          Wallet
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mi Wallet</h1>
        <p className="mt-1 text-muted-foreground">Tus fondos en el sistema y en blockchain</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          <BalanceCard
            walletBalance={walletQuery.data?.balance}
            totalLkn={totalLkn}
            availableLkn={availableLkn}
            reservedLkn={reservedLkn}
            holdingsLoading={holdingsQuery.isLoading || ordersQuery.isLoading}
            walletLoading={walletQuery.isLoading}
            holderAddress={holderAddress}
          />
        </div>

        <div className="min-w-0">
          <MovementHistoryCard
            isLoading={movementsQuery.isLoading}
            movements={movements}
          />
        </div>

        <div className="min-w-0">
          <ClaimDividendsCard />
        </div>

        <div className="min-w-0">
          <WalletStatusCard />
        </div>
      </div>
    </div>
  )
}
