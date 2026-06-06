"use client"

import Link from "next/link"
import {
  TrendingUp,
  Wallet,
  Leaf,
  Zap,
  ArrowUpRight,
  Sun,
  Wind,
  Droplets,
} from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/providers/session-provider"
import { useProjects } from "@/features/projects/hooks/use-projects"
import { useInvestmentTotal } from "@/features/invest/hooks/use-investments"
import { useMyDividends } from "@/features/invest/hooks/use-dividends"
import { AdminDashboard } from "@/features/admin/components/admin-dashboard"
import { formatCurrency } from "@/shared/lib/utils"
import { ERC20_ABI } from "@/features/web3/lib/abis"
import { env } from "@/shared/config/env"
import type { EnergyType } from "@/features/projects/types/projects"

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

export default function DashboardPage() {
  const { permissions } = useSession()

  if (permissions.isAdmin) {
    return <AdminDashboard />
  }

  return <InvestorDashboard />
}

function InvestorDashboard() {
  const { user } = useSession()
  const { address: connectedAddress } = useAccount()
  const projectsQuery = useProjects()
  const investmentTotalQuery = useInvestmentTotal()
  const dividendsQuery = useMyDividends(0, 100)
  const projects = projectsQuery.data?.content ?? []
  const displayName = user?.email?.split("@")[0] ?? "usuario"
  const totalInvested = investmentTotalQuery.data?.totalUsdcInvested ?? "0"
  const claimedDividends = sumAmounts(dividendsQuery.data?.content.map((claim) => claim.amount))
  const walletAddress = user?.walletAddress ?? connectedAddress ?? null

  const isValidLknAddress = env.lknAddress && env.lknAddress !== "0x0000000000000000000000000000000000000000"

  const { data: lknBalanceRaw, isLoading: lknLoading } = useReadContract({
    address: env.lknAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: walletAddress ? [walletAddress] : undefined,
    query: { enabled: !!walletAddress && isValidLknAddress },
  })

  const lknBalanceDisplay = (() => {
    if (!isValidLknAddress) return "Token no configurado"
    if (!walletAddress) {
      return (
        <Button variant="outline" size="sm" asChild className="mt-1">
          <Link href="/dashboard/wallet">Vinculá o conectá tu wallet</Link>
        </Button>
      )
    }
    if (lknLoading) return null
    if (lknBalanceRaw === undefined) return formatTokenAmount("0")
    return formatTokenAmount(formatUnits(lknBalanceRaw, 18))
  })()

  const stats: Array<{
    title: string
    value: React.ReactNode
    change: string
    icon: React.ElementType
    accent?: boolean
  }> = [
    {
      title: "Total invertido",
      value: investmentTotalQuery.isLoading ? null : formatCurrency(totalInvested),
      change: investmentTotalQuery.data?.currentTier ?? "",
      icon: Wallet,
      accent: true,
    },
    {
      title: "Dividendos cobrados",
      value: dividendsQuery.isLoading ? null : formatCurrency(claimedDividends),
      change: Number(claimedDividends) > 0 ? "+" : "",
      icon: TrendingUp,
    },
    {
      title: "Tokens LKN",
      value: lknBalanceDisplay,
      change: walletAddress ? "Balance on-chain" : "",
      icon: Zap,
    },
    {
      title: "Proyectos disponibles",
      value: projectsQuery.isLoading ? null : String(projects.length),
      change: "",
      icon: Leaf,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.72_0.16_165)]" />
          Resumen
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenido de vuelta, {displayName}. Aca esta el resumen de tu portafolio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card transition-colors duration-300 hover:border-primary/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 ${stat.accent ? "bg-primary text-primary-foreground shadow-[0_0_22px_-5px_oklch(0.72_0.16_165/0.8)]" : "bg-primary/12 text-primary"}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.change && (
                  <span className="flex items-center text-sm font-medium text-green-500">
                    {stat.change}
                    {stat.change === "+" && <ArrowUpRight className="ml-1 h-4 w-4" />}
                  </span>
                )}
              </div>
              <div className="mt-4">
                {stat.value == null ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <div className={`text-2xl font-bold ${stat.accent ? "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" : "text-foreground"}`}>{stat.value}</div>
                )}
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Proyectos disponibles</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/projects">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectsQuery.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay proyectos disponibles.</p>
              ) : (
                projects.slice(0, 4).map((project) => {
                  const Icon = energyIcons[project.energyType] ?? Leaf
                  const status = stateLabels[project.state] ?? stateLabels.DRAFT
                  return (
                    <div key={project.id} className="flex items-center gap-4 rounded-xl border border-transparent bg-secondary/50 p-4 transition-colors hover:border-primary/30 hover:bg-secondary">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/12">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-medium text-foreground">{project.name}</p>
                          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{project.country}</span>
                          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-semibold text-transparent">
                            {parseFloat(project.expectedAnnualYield).toFixed(1)}% APY
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Acciones Rapidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { href: "/dashboard/projects", label: "Explorar Proyectos", icon: Leaf },
                { href: "/dashboard/marketplace", label: "Ir al Marketplace", icon: TrendingUp },
                { href: "/dashboard/wallet", label: "Depositar Fondos", icon: Wallet },
                { href: "/dashboard/investments", label: "Ver Inversiones", icon: Zap },
              ].map((action) => (
                <Button
                  key={action.href}
                  variant="outline"
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <Link href={action.href}>
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function sumAmounts(values?: Array<string | number | null | undefined>) {
  const total = (values ?? []).reduce<number>((acc, value) => {
    const amount = Number(value ?? 0)
    return Number.isFinite(amount) ? acc + amount : acc
  }, 0)

  return total.toString()
}

function formatTokenAmount(value?: string | number | null) {
  const amount = Number(value ?? 0)
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 4,
  }).format(Number.isFinite(amount) ? amount : 0)
}
