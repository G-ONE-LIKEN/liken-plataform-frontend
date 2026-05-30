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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/providers/session-provider"
import { useProjects } from "@/features/projects/hooks/use-projects"
import type { EnergyType } from "@/features/projects/types/projects"

const energyIcons: Record<EnergyType, React.ElementType> = {
  SOLAR: Sun,
  WIND: Wind,
  HYDRO: Droplets,
  BIOMASS: Leaf,
}

const stateLabels: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Activo", className: "bg-green-500/10 text-green-500" },
  PRE_OPEN: { label: "Próximamente", className: "bg-primary/10 text-primary" },
  DRAFT: { label: "Borrador", className: "bg-muted text-muted-foreground" },
  CLOSED: { label: "Cerrado", className: "bg-secondary text-secondary-foreground" },
  CANCELLED: { label: "Cancelado", className: "bg-destructive/10 text-destructive" },
}

export default function DashboardPage() {
  const { user } = useSession()
  const projectsQuery = useProjects()
  const projects = projectsQuery.data?.content ?? []
  const displayName = user?.email?.split("@")[0] ?? "usuario"

  const stats = [
    { title: "Valor del Portafolio", value: "$0.00", change: "—", icon: Wallet },
    { title: "Rendimiento Total", value: "$0.00", change: "—", icon: TrendingUp },
    { title: "Tokens LKN", value: "0", change: "—", icon: Zap },
    { title: "Proyectos disponibles", value: String(projects.length || "—"), change: "", icon: Leaf },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenido de vuelta, {displayName}. Aquí está el resumen de tu portafolio.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                {stat.change && (
                  <span className="flex items-center text-sm font-medium text-green-500">
                    {stat.change}
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Proyectos recientes */}
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
                    <div key={project.id} className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-medium text-foreground">{project.name}</p>
                          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{project.country}</span>
                          <span className="text-primary font-semibold">
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

        {/* Acciones rápidas */}
        <div>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
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
