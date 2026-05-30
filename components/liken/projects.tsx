import { Sun, Wind, CheckCircle2, MapPin, Zap, TrendingUp, Users, Clock } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "Parque Solar Mendoza",
    type: "Solar fotovoltaico",
    icon: Sun,
    location: "Lavalle, Mendoza",
    capacity: "3 MW",
    apy: "11.5%",
    totalRaised: "$1.4M",
    investors: 138,
    duration: "12 meses",
    completedAt: "Ago 2023",
  },
  {
    id: 2,
    name: "Viento Patagónico Sur",
    type: "Eólica",
    icon: Wind,
    location: "Comodoro Rivadavia, Chubut",
    capacity: "6 MW",
    apy: "13.2%",
    totalRaised: "$3.1M",
    investors: 214,
    duration: "18 meses",
    completedAt: "Mar 2024",
  },
  {
    id: 3,
    name: "Solar Puna Norte",
    type: "Solar fotovoltaico",
    icon: Sun,
    location: "Susques, Jujuy",
    capacity: "4 MW",
    apy: "12.1%",
    totalRaised: "$1.9M",
    investors: 172,
    duration: "14 meses",
    completedAt: "Nov 2023",
  },
]

export function Projects() {
  return (
    <section id="proyectos" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <CheckCircle2 className="h-4 w-4" />
            Proyectos finalizados
          </div>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ya lo hicimos en Argentina
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Estos parques ya completaron su ciclo de financiamiento y están generando energía — y dividendos — para sus inversores.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/40"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <project.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight text-foreground">{project.name}</h3>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {project.location}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  Finalizado
                </div>
              </div>

              {/* APY highlight */}
              <div className="mx-6 rounded-xl bg-primary/8 px-4 py-3 ring-1 ring-primary/15">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">APY entregado</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-2xl font-bold text-primary">{project.apy}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total recaudado</p>
                    <p className="mt-0.5 text-xl font-bold text-foreground">{project.totalRaised}</p>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-px bg-border/30 mx-6 mt-4 overflow-hidden rounded-xl">
                <div className="bg-card px-4 py-3">
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{project.type}</p>
                </div>
                <div className="bg-card px-4 py-3">
                  <p className="text-xs text-muted-foreground">Capacidad</p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium text-foreground">{project.capacity}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between px-6 py-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{project.investors} inversores</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{project.duration}</span>
                </div>
                <span className="font-medium text-foreground/60">Cerrado {project.completedAt}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
