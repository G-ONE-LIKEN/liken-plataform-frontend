"use client"

import { motion } from "framer-motion"
import { TrendingUp, Repeat2, BarChart3, Wifi } from "lucide-react"
import { GradientBar, gradientText } from "@/components/liken/atmosphere"

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
    <section id="tokenomics" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.72_0.16_165)]" />
            Tokenomics $LKN
          </p>
          <h2 className="max-w-lg text-3xl font-bold tracking-[-0.02em] text-foreground text-balance sm:text-4xl">
            ¿Qué gana el inversor?
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xl">
            Cada token $LKN representa una fracción real de un parque de energía renovable. Dividendos reales, liquidez garantizada y transparencia on-chain.
          </p>
        </motion.div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">

          {/* Left — benefit tiles */}
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group rounded-2xl border border-border/70 bg-card/70 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/12 transition-colors group-hover:bg-primary/20">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-xs font-medium tracking-wide text-primary">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right — token card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
          >
            <GradientBar />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-10 -z-0 h-52 w-52 rounded-full opacity-50 blur-3xl"
              style={{ background: "radial-gradient(circle, oklch(0.80 0.12 85 / 0.30), transparent 70%)" }}
            />
            {/* Card header */}
            <div className="relative border-b border-border p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_24px_-4px_oklch(0.72_0.16_165/0.7)]">
                  <span className="text-base font-bold">L</span>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Token nativo
                  </p>
                  <h3 className="text-sm font-bold text-foreground">$LKN · LIKEN</h3>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/8 px-4 py-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-primary/70">
                  APY promedio
                </p>
                <p className={`mt-1 text-5xl font-bold tracking-[-0.03em] tabular-nums ${gradientText()}`}>
                  12.5%
                </p>
                <p className="mt-1 text-xs text-muted-foreground">sobre activos tokenizados</p>
              </div>
            </div>

            {/* Stats list */}
            <div className="divide-y divide-border/60 px-5">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-3">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-xs font-medium text-foreground">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 pt-4">
              <p className="text-center text-[10px] text-muted-foreground tracking-wide">
                Energía tokenizada en blockchain · Respaldo físico real
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
