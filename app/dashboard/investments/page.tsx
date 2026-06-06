"use client"

import Link from "next/link"
import { TrendingUp, Wallet, Zap, Gift, ArrowUpRight, Sun, Wind, Droplets, Leaf } from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { useInvestmentTotal, useMyInvestments } from "@/features/invest/hooks/use-investments"
import { useMyDividends, usePendingDividends } from "@/features/invest/hooks/use-dividends"
import { InvestmentHistory } from "@/features/invest/components/investment-history"
import { DividendHistory } from "@/features/invest/components/dividend-history"
import { ClaimDividendsCard } from "@/features/invest/components/claim-dividends-card"
import { useProjects } from "@/features/projects/hooks/use-projects"
import { useWalletMovements } from "@/features/wallet/hooks/use-wallet"
import { useSession } from "@/providers/session-provider"
import { ERC20_ABI } from "@/features/web3/lib/abis"
import { env } from "@/shared/config/env"
import { formatCurrency } from "@/shared/lib/utils"
import type { EnergyType } from "@/features/projects/types/projects"
import type { MovementType } from "@/features/wallet/types/wallet"

const energyIcons: Record<EnergyType, React.ElementType> = {
  SOLAR: Sun,
  WIND: Wind,
  HYDRO: Droplets,
  BIOMASS: Leaf,
}

const stateLabels: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Activo", className: "bg-green-500/10 text-green-500" },
  PRE_OPEN: { label: "En captacion", className: "bg-primary/10 text-primary" },
  DRAFT: { label: "Borrador", className: "bg-muted text-muted-foreground" },
  CLOSED: { label: "Cerrado", className: "bg-secondary text-secondary-foreground" },
  CANCELLED: { label: "Cancelado", className: "bg-destructive/10 text-destructive" },
}

function formatTokenAmount(value?: string | number | null) {
  const amount = Number(value ?? 0)
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 4 }).format(Number.isFinite(amount) ? amount : 0)
}

function sumAmounts(values?: Array<string | number | null | undefined>) {
  const total = (values ?? []).reduce<number>((acc, value) => {
    const amount = Number(value ?? 0)
    return Number.isFinite(amount) ? acc + amount : acc
  }, 0)
  return total.toString()
}

function percentage(part: number, total: number) {
  if (!total || total <= 0) return 0
  return Math.min(100, Math.round((part / total) * 100))
}

export default function InvestmentsPage() {
  const { user } = useSession()
  const { address: connectedAddress } = useAccount()

  const linkedWallet = user?.walletAddress ?? null
  const wallet = linkedWallet ?? connectedAddress ?? null

  const projectsQuery = useProjects()
  const investmentTotalQuery = useInvestmentTotal()
  const investmentsQuery = useMyInvestments(0, 100)
  const dividendsQuery = useMyDividends(0, 100)
  const movementsQuery = useWalletMovements(0, 10)

  const totalInvested = investmentTotalQuery.data?.totalUsdcInvested ?? "0"
  const claimedDividends = sumAmounts(dividendsQuery.data?.content.map((c) => c.amount))

  const isValidLknAddress = env.lknAddress && env.lknAddress !== "0x0000000000000000000000000000000000000000"

  const { data: lknBalanceRaw, isLoading: lknLoading } = useReadContract({
    address: env.lknAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: wallet ? [wallet] : undefined,
    query: { enabled: !!wallet && isValidLknAddress },
  })

  const pending = usePendingDividends(wallet)
  const pendingUsdc = pending.data?.pendingUsdc ?? "0"
  const lknBalance = lknBalanceRaw !== undefined ? Number(formatUnits(lknBalanceRaw, 18)) : 0

  const lknDisplay = (() => {
    if (!isValidLknAddress) return "No configurado"
    if (!wallet) return "Vinculá o conectá tu wallet"
    if (lknLoading) return "..."
    if (lknBalanceRaw === undefined) return formatTokenAmount("0")
    return formatTokenAmount(lknBalance)
  })()

  const projectMap = new Map<number, { lkn: number; usdc: number }>()
  for (const inv of investmentsQuery.data?.content ?? []) {
    const curr = projectMap.get(inv.projectId) ?? { lkn: 0, usdc: 0 }
    curr.lkn += Number(inv.lknAmount)
    curr.usdc += Number(inv.usdcAmount)
    projectMap.set(inv.projectId, curr)
  }

  const investedProjectIds = Array.from(projectMap.keys())
  const investedProjects = investedProjectIds.map((id) => {
    const proj = projectsQuery.data?.content.find((p) => p.id === id)
    const totals = projectMap.get(id)!
    const totalUsdcNum = Number(totalInvested) || 1
    return {
      id,
      name: proj?.name ?? `Proyecto #${id}`,
      energyType: proj?.energyType ?? "SOLAR",
      state: proj?.state ?? "DRAFT",
      apy: proj?.expectedAnnualYield ? parseFloat(proj.expectedAnnualYield).toFixed(1) : "0.0",
      lkn: totals.lkn,
      usdc: totals.usdc,
      pct: percentage(totals.usdc, totalUsdcNum),
    }
  })

  const movementCounts = (movementsQuery.data?.content ?? []).reduce<Record<string, number>>((acc, movement) => {
    acc[movement.type] = (acc[movement.type] ?? 0) + 1
    return acc
  }, {})

  const summaryCards = [
    {
      label: "Total invertido",
      value: investmentTotalQuery.isLoading ? null : formatCurrency(totalInvested),
      sub: investmentTotalQuery.data?.currentTier ? `Tier ${investmentTotalQuery.data.currentTier}` : undefined,
      icon: Wallet,
    },
    {
      label: "Tokens LKN",
      value: lknDisplay,
      sub: wallet ? "Balance on-chain" : undefined,
      icon: Zap,
    },
    {
      label: "Proyectos invertidos",
      value: investmentsQuery.isLoading ? null : String(investedProjectIds.length),
      sub: undefined,
      icon: TrendingUp,
    },
    {
      label: "Dividendos pendientes",
      value: pending.isLoading ? null : formatCurrency(pendingUsdc),
      sub: Number(pendingUsdc) > 0 ? "Disponibles para reclamar" : undefined,
      icon: Gift,
    },
  ]

  const isLoading = investmentTotalQuery.isLoading || investmentsQuery.isLoading || projectsQuery.isLoading

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.72_0.16_165)]" />
            Portafolio
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Mis Inversiones</h1>
          <p className="mt-1 text-muted-foreground">Análisis detallado de tu portafolio de energía renovable</p>
        </div>
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/dashboard/projects">
            <ArrowUpRight className="h-4 w-4" />
            Invertir
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((item) => (
          <Card key={item.label} className="bg-card transition-colors duration-300 hover:border-primary/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/12">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  {item.value === null ? (
                    <Skeleton className="mt-1 h-7 w-24" />
                  ) : (
                    <div className="mt-1">
                      <p className="text-2xl font-bold text-foreground">{item.value}</p>
                      {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="portfolio">Portafolio por proyecto</TabsTrigger>
          <TabsTrigger value="dividends">Dividendos</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : investedProjects.length === 0 ? (
            <Card className="bg-card">
              <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 shadow-[0_0_30px_-8px_oklch(0.72_0.16_165/0.7)]">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <p className="text-base font-medium text-foreground">No tenés inversiones activas aún</p>
                <p className="mt-1 text-sm text-muted-foreground">Explorá proyectos de energía renovable y realizá tu primera inversión.</p>
                <Button className="mt-6 gap-2" asChild>
                  <Link href="/dashboard/projects">
                    <ArrowUpRight className="h-4 w-4" />
                    Explorar Proyectos
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {investedProjects.map((proj) => {
                const Icon = energyIcons[proj.energyType] ?? Leaf
                const status = stateLabels[proj.state] ?? stateLabels.DRAFT
                return (
                  <Card key={proj.id} className="bg-card transition-colors hover:border-primary/30">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/12">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link href={`/projects/${proj.id}`} className="font-semibold text-foreground hover:text-primary">
                                {proj.name}
                              </Link>
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                                {status.label}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{formatTokenAmount(proj.lkn)} LKN</span>
                              <span>·</span>
                              <span>{formatCurrency(String(proj.usdc))} invertidos</span>
                              <span>·</span>
                              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-semibold text-transparent">
                                {proj.apy}% APY
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-48">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>% del portafolio</span>
                            <span className="font-medium text-foreground">{proj.pct}%</span>
                          </div>
                          <Progress value={proj.pct} className="mt-2 h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="dividends" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ClaimDividendsCard />
            <DividendHistory />
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <InvestmentHistory />
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Ledger Web2 + Web3</CardTitle>
              </CardHeader>
              <CardContent>
                {movementsQuery.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : movementsQuery.data && movementsQuery.data.content.length > 0 ? (
                  <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <MiniLedgerStat label="Compras registradas" value={String(movementCounts.TOKEN_PURCHASE ?? 0)} />
                      <MiniLedgerStat label="Dividendos registrados" value={String(movementCounts.DIVIDEND ?? 0)} />
                      <MiniLedgerStat label="Refunds registrados" value={String(movementCounts.REFUND ?? 0)} />
                    </div>

                    <ul className="divide-y divide-border">
                      {movementsQuery.data.content.map((movement) => {
                        const positive = movement.type === "DIVIDEND" || movement.type === "REFUND" || movement.type === "DEPOSIT" || movement.type === "P2P_SALE"
                        return (
                          <li key={movement.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-foreground">{movementLabel(movement.type)}</p>
                              <p className="text-xs text-muted-foreground">
                                {movement.description ?? "Movimiento registrado en tu cuenta operativa"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(movement.createdAt).toLocaleString("es-AR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${positive ? "text-green-500" : "text-destructive"}`}>
                                {positive ? "+" : "-"}{formatCurrency(movement.amount)}
                              </p>
                              <p className="text-xs text-muted-foreground">Saldo {formatCurrency(movement.balanceAfter)}</p>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
                    Todavía no hay transacciones conciliadas en tu ledger.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function movementLabel(type: MovementType) {
  switch (type) {
    case "DEPOSIT":
      return "Depósito"
    case "WITHDRAWAL":
      return "Retiro"
    case "DIVIDEND":
      return "Dividendo reclamado"
    case "TOKEN_PURCHASE":
      return "Compra de LKN"
    case "REFUND":
      return "Refund de ronda"
    case "P2P_SALE":
      return "Venta P2P"
    case "P2P_PURCHASE":
      return "Compra P2P"
    default:
      return type
  }
}

function MiniLedgerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  )
}
