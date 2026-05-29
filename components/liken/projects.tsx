"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sun, Wind, Droplets, ArrowUpRight } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "Solar Valley - Chile",
    type: "Solar",
    icon: Sun,
    location: "Atacama, Chile",
    capacity: "50 MW",
    apy: "14.2%",
    funded: 78,
    minInvestment: "$100",
    status: "Activo",
  },
  {
    id: 2,
    name: "Wind Coast - España",
    type: "Eólica",
    icon: Wind,
    location: "Galicia, España",
    capacity: "120 MW",
    apy: "11.8%",
    funded: 92,
    minInvestment: "$250",
    status: "Activo",
  },
  {
    id: 3,
    name: "Hydro Norte - Colombia",
    type: "Hidroeléctrica",
    icon: Droplets,
    location: "Antioquia, Colombia",
    capacity: "80 MW",
    apy: "12.5%",
    funded: 45,
    minInvestment: "$150",
    status: "Financiando",
  },
]

export function Projects() {
  return (
    <section id="proyectos" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Proyectos
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Oportunidades de inversión
            </h2>
            <p className="mt-2 text-muted-foreground">
              Explora proyectos de energía renovable verificados y tokenizados.
            </p>
          </div>
          <Button variant="outline" className="shrink-0 gap-2 border-border text-foreground">
            Ver todos
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <project.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </div>
                </div>
                <Badge 
                  variant={project.status === "Activo" ? "default" : "secondary"}
                  className={project.status === "Activo" ? "bg-primary/20 text-primary border-primary/30" : ""}
                >
                  {project.status}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Capacidad</p>
                    <p className="font-semibold text-foreground">{project.capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">APY Estimado</p>
                    <p className="font-semibold text-primary">{project.apy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mín. Inversión</p>
                    <p className="font-semibold text-foreground">{project.minInvestment}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="font-semibold text-foreground">{project.type}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Financiado</span>
                    <span className="font-medium text-foreground">{project.funded}%</span>
                  </div>
                  <Progress value={project.funded} className="h-2" />
                </div>

                {/* CTA */}
                <Button className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Invertir Ahora
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
