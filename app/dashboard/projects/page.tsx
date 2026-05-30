"use client"

import { Filter, Search } from "lucide-react"
import { Sun, Wind, Droplets, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { AccessGate } from "@/features/auth/components/access-gate"
import { ProjectCard } from "@/features/projects/components/project-card"
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog"
import { useProjects } from "@/features/projects/hooks/use-projects"
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
