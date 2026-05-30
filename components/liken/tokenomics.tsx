import { TrendingUp, Repeat2, BarChart3, Wifi } from "lucide-react"

const benefits = [
  {
    icon: TrendingUp,
    title: "Dividendo mensual",
    description: "Cobrás tu parte de los ingresos por generación real de energía cada mes.",
    badge: "Ingresos pasivos",
  },
  {
    icon: Repeat2,
    title: "Liquidez inmediata",
    description: "Vendé tus tokens en el Marketplace sin plazos fijos ni penalidades.",
    badge: "Sin lock-up",
  },
  {
    icon: BarChart3,
    title: "Revalorización $LKN",
    description: "Plusvalía a medida que el proyecto se consolida y escala.",
    badge: "Upside potencial",
  },
  {
    icon: Wifi,
    title: "Auditoría IoT",
    description: "Visibilidad total sobre la generación de energía del parque en tiempo real.",
    badge: "100% verificable",
  },
]

const stats = [
  { label: "Dividendos", value: "Mensual por parque" },
  { label: "Liquidez", value: "Marketplace P2P" },
  { label: "Respaldo", value: "Activo físico real" },
  { label: "Auditoría", value: "IoT en tiempo real" },
]

export function Tokenomics() {
  return (
    <section id="tokenomics" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Tokenomics $LKN
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Qué gana el inversor?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Cada token $LKN representa una fracción real de un parque de energía renovable. Dividendos reales, liquidez garantizada y transparencia on-chain.
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_380px]">

          {/* Left — 2x2 benefit cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-border/50 bg-card p-6 transition-colors hover:border-primary/40 hover:bg-card/80"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Right — token card */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-primary/15 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/10 blur-2xl" />

              {/* Card top */}
              <div className="relative border-b border-border/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                    <span className="text-xl font-bold text-primary-foreground">L</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Token nativo</p>
                    <h3 className="text-lg font-bold text-foreground">$LKN · LIKEN</h3>
                  </div>
                </div>

                {/* APY highlight */}
                <div className="mt-6 rounded-xl bg-primary/10 px-4 py-4 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary/70">APY promedio</p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-primary">12.5%</p>
                  <p className="mt-1 text-xs text-muted-foreground">sobre activos tokenizados</p>
                </div>
              </div>

              {/* Card details */}
              <div className="relative divide-y divide-border/40 px-6">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-3.5">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <span className="text-sm text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div className="relative px-6 pb-6 pt-4">
                <p className="text-center text-xs text-muted-foreground">
                  Energía tokenizada en blockchain · Respaldo físico real
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
