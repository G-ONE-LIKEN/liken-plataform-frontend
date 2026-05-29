"use client"

import { Sun, Wind, Droplets, Leaf, Filter, Search, TrendingUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AccessGate } from "@/features/auth/components/access-gate"
import { useProjects } from "@/features/projects/hooks/use-projects"
import { useSession } from "@/providers/session-provider"
import type { EnergyType, ProjectState } from "@/features/projects/types/projects"
import { useState } from "react"

const energyIcons: Record<EnergyType, React.ElementType> = {
  SOLAR: Sun,
  WIND: Wind,
  HYDRO: Droplets,
  BIOMASS: Leaf,
}

const energyLabels: Record<EnergyType, string> = {
  SOLAR: "Solar",
  WIND: "Eólica",
  HYDRO: "Hidroeléctrica",
  BIOMASS: "Biomasa",
}

const stateConfig: Record<ProjectState, { label: string; className: string }> = {
  OPEN: { label: "Activo", className: "bg-green-500/10 text-green-500" },
  PRE_OPEN: { label: "En Financiamiento", className: "bg-accent/10 text-accent" },
  DRAFT: { label: "Borrador", className: "bg-muted text-muted-foreground" },
  CLOSED: { label: "Cerrado", className: "bg-secondary text-secondary-foreground" },
  CANCELLED: { label: "Cancelado", className: "bg-destructive/10 text-destructive" },
}

const filterTypes = [
  { label: "Todos", value: null },
  { label: "Solar", value: "SOLAR" as EnergyType, icon: Sun },
  { label: "Eólica", value: "WIND" as EnergyType, icon: Wind },
  { label: "Hidroeléctrica", value: "HYDRO" as EnergyType, icon: Droplets },
  { label: "Biomasa", value: "BIOMASS" as EnergyType, icon: Leaf },
]

export default function DashboardProjectsPage() {
  const { permissions } = useSession()
  const projectsQuery = useProjects()
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<EnergyType | null>(null)

  const allProjects = projectsQuery.data?.content ?? []

  const filtered = allProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = activeFilter === null || p.energyType === activeFilter
    return matchesSearch && matchesFilter
  })

  return (
    <AccessGate allow={(ctx) => ctx.canReadProjects}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Proyectos</h1>
            <p className="mt-1 text-muted-foreground">
              Explora proyectos de energía renovable disponibles para inversión
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos..."
                className="w-64 pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {permissions.canManageProjects && (
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Crear
              </Button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {filterTypes.map(({ label, value, icon: Icon }) => (
            <Button
              key={label}
              variant={activeFilter === value ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setActiveFilter(value)}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {label}
            </Button>
          ))}
        </div>

        {/* Projects grid */}
        {projectsQuery.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-secondary/50" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Filter className="mb-3 h-10 w-10 opacity-40" />
            <p className="text-sm">No se encontraron proyectos.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => {
              const Icon = energyIcons[project.energyType] ?? Leaf
              const status = stateConfig[project.state] ?? stateConfig.DRAFT
              const apy = parseFloat(project.expectedAnnualYield || "0").toFixed(1)
              const minInv = parseFloat(project.minimumInvestment || "0")
              return (
                <Card
                  key={project.id}
                  className="overflow-hidden bg-card transition-all hover:border-primary/50"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 border-b border-border p-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-semibold text-foreground">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.country}
                          {project.province ? ` · ${project.province}` : ""}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-4 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">APY Estimado</span>
                        <span className="flex items-center gap-1 text-lg font-bold text-primary">
                          <TrendingUp className="h-4 w-4" />
                          {apy}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Tipo</span>
                        <span className="font-medium text-foreground">
                          {energyLabels[project.energyType] ?? project.energyType}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Inversión mínima</p>
                          <p className="font-semibold text-foreground">
                            ${minInv.toLocaleString()} USD
                          </p>
                        </div>
                        <Button size="sm">Invertir</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AccessGate>
  )
}
