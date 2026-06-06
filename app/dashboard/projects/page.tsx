"use client"

import Link from "next/link"
import { Filter, Search } from "lucide-react"
import { Sun, Wind, Droplets, Leaf, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AccessGate } from "@/features/auth/components/access-gate"
import { ProjectCard } from "@/features/projects/components/project-card"
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog"
import { useMyProjects, useProjects } from "@/features/projects/hooks/use-projects"
import { useSession } from "@/providers/session-provider"
import type { EnergyType } from "@/features/projects/types/projects"
import { useState } from "react"

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
  const myProjectsQuery = useMyProjects()
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<EnergyType | null>(null)

  const allProjects = projectsQuery.data?.content ?? []
  const myProjects = myProjectsQuery.data?.content ?? []
  const hiddenMine = myProjects.filter(
    (project) => project.state === "PENDING_APPROVAL" || project.state === "DRAFT",
  )
  const pendingMineCount = hiddenMine.filter((project) => project.state === "PENDING_APPROVAL").length
  const draftMineCount = hiddenMine.filter((project) => project.state === "DRAFT").length

  const filtered = allProjects.filter((p) => {
    // Fase 6: ocultamos del catálogo público los proyectos que aún no están
    // visibles al inversor (PENDING_APPROVAL todavía sin revisar, DRAFT aprobado
    // pero sin publicar). Solo aparecen PRE_OPEN/OPEN/CLOSED/CANCELLED.
    if (p.state === "PENDING_APPROVAL" || p.state === "DRAFT") return false

    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = activeFilter === null || p.energyType === activeFilter
    return matchesSearch && matchesFilter
  })

  return (
    <AccessGate allow={(ctx) => ctx.canReadProjects}>
        <div className="space-y-8">
        {permissions.canManageProjects && hiddenMine.length > 0 && (
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="text-primary" />
            <AlertTitle>Tenés proyectos propios que todavía no figuran en el catálogo público</AlertTitle>
            <AlertDescription>
              <p>
                {pendingMineCount > 0 && `${pendingMineCount} pendiente${pendingMineCount === 1 ? "" : "s"} de aprobación`}
                {pendingMineCount > 0 && draftMineCount > 0 && " y "}
                {draftMineCount > 0 && `${draftMineCount} en borrador`}
                . Recién aparecen para inversores cuando avanzan a <span className="font-medium text-foreground">PRE_OPEN</span> u <span className="font-medium text-foreground">OPEN</span>.
              </p>
              <p className="flex flex-wrap gap-2 pt-1">
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/projects/mine">Ver mis proyectos</Link>
                </Button>
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.72_0.16_165)]" />
              Catálogo
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Proyectos</h1>
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
            {permissions.canManageProjects && <CreateProjectDialog />}
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
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Filter className="mb-3 h-10 w-10 opacity-40" />
            <p className="text-sm font-medium">No se encontraron proyectos</p>
            <p className="mt-1 text-xs">Probá con otros filtros o términos de búsqueda.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </AccessGate>
  )
}
