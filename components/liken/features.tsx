import { Coins, Lock, BarChart3, Globe, Zap, FileCheck } from "lucide-react"

const features = [
  {
    icon: Coins,
    title: "Tokenización de Activos",
    description: "Convierte activos energéticos en tokens fraccionados. Invierte desde pequeñas cantidades en proyectos de alto valor.",
  },
  {
    icon: Lock,
    title: "Seguridad Blockchain",
    description: "Tus inversiones están protegidas por contratos inteligentes auditados y la inmutabilidad de la blockchain.",
  },
  {
    icon: BarChart3,
    title: "Rendimientos Transparentes",
    description: "Monitorea en tiempo real el rendimiento de tus inversiones. Sin comisiones ocultas ni intermediarios.",
  },
  {
    icon: Globe,
    title: "Impacto Global",
    description: "Contribuye a la transición energética mundial mientras generas rendimientos competitivos.",
  },
  {
    icon: Zap,
    title: "Liquidez Instantánea",
    description: "Compra y vende tokens de energía 24/7 en nuestro marketplace descentralizado.",
  },
  {
    icon: FileCheck,
    title: "Cumplimiento Regulatorio",
    description: "Operamos bajo estrictos estándares regulatorios internacionales para proteger tu inversión.",
  },
]

export function Features() {
  return (
    <section id="como-funciona" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Cómo Funciona
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Inversión en energía simplificada
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            LIKEN democratiza el acceso a inversiones en infraestructura energética mediante tecnología blockchain.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
