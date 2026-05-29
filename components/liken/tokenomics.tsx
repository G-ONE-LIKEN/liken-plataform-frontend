import { Wallet, Users, Building2, Landmark, PieChart } from "lucide-react"

const distribution = [
  { name: "Inversores", percentage: 40, icon: Users, color: "bg-primary" },
  { name: "Reserva de Liquidez", percentage: 25, icon: Wallet, color: "bg-accent" },
  { name: "Desarrollo", percentage: 20, icon: Building2, color: "bg-chart-3" },
  { name: "Fundadores", percentage: 10, icon: Landmark, color: "bg-chart-4" },
  { name: "Marketing", percentage: 5, icon: PieChart, color: "bg-chart-5" },
]

export function Tokenomics() {
  return (
    <section id="tokenomics" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Tokenomics
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Token LKN: El corazón de LIKEN
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              El token LKN es el activo nativo de nuestra plataforma. Utilízalo para invertir en proyectos, recibir recompensas y participar en la gobernanza del ecosistema.
            </p>

            <div className="mt-8 space-y-4">
              {distribution.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}/20`}>
                    <item.icon className={`h-5 w-5 ${item.color === "bg-primary" ? "text-primary" : item.color === "bg-accent" ? "text-accent" : "text-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="text-sm font-semibold text-primary">{item.percentage}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Token Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Glow Effect */}
              <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-xl" />
              
              {/* Card */}
              <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-8">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
                
                <div className="relative">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                      <span className="text-2xl font-bold text-primary-foreground">L</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">LKN Token</h3>
                      <p className="text-sm text-muted-foreground">ERC-20 en Ethereum</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <span className="text-muted-foreground">Suministro Total</span>
                      <span className="font-semibold text-foreground">100,000,000 LKN</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <span className="text-muted-foreground">Precio Inicial</span>
                      <span className="font-semibold text-foreground">$0.10 USD</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <span className="text-muted-foreground">Red</span>
                      <span className="font-semibold text-foreground">Ethereum / Polygon</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Vesting</span>
                      <span className="font-semibold text-foreground">24 meses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
