"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sun, Wind, CheckCircle2, MapPin, Zap, TrendingUp, Users, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gradientText } from "@/components/liken/atmosphere"

const projects = [
  {
    id: 1,
    name: "Parque Solar Mendoza",
    type: "Solar",
    icon: Sun,
    location: "Lavalle, Mendoza",
    capacity: "3 MW",
    apy: "11.5%",
    totalRaised: "$1.4M",
    investors: 138,
    duration: "12 meses",
    completedAt: "Ago 2023",
    funded: 100,
    minInvestment: "$10",
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
    funded: 100,
    minInvestment: "$10",
  },
  {
    id: 3,
    name: "Solar Puna Norte",
    type: "Solar",
    icon: Sun,
    location: "Susques, Jujuy",
    capacity: "4 MW",
    apy: "12.1%",
    totalRaised: "$1.9M",
    investors: 172,
    duration: "14 meses",
    completedAt: "Nov 2023",
    funded: 100,
    minInvestment: "$10",
  },
]

export function Projects() {
  return (
    <section id="proyectos" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1.5 text-xs font-medium tracking-wide text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Proyectos finalizados
            </div>
            <h2 className="max-w-lg text-3xl font-bold tracking-[-0.02em] text-foreground text-balance sm:text-4xl">
              Ya lo hicimos en Argentina
            </h2>
            <p className="mt-3 text-base text-muted-foreground max-w-xl">
              Estos parques completaron su ciclo y están generando dividendos para sus inversores.
            </p>
          </div>
          <Link href="/projects" className="shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5 border-border text-muted-foreground hover:text-foreground">
              Ver proyectos activos
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_50px_-30px_oklch(0.72_0.16_165/0.7)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/12">
                    <project.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight text-foreground">
                      {project.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-border/60 bg-muted/30 px-2.5 py-0.5 text-xs text-muted-foreground">
                  {project.type}
                </span>
              </div>

              {/* APY + raised */}
              <div className="mx-6 mb-4 rounded-xl border border-border/80 bg-background/40 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-0.5 text-xs text-muted-foreground">APY entregado</p>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      <span className={`text-2xl font-bold tabular-nums tracking-tight ${gradientText()}`}>
                        {project.apy}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-0.5">Total recaudado</p>
                    <p className="text-xl font-bold tabular-nums tracking-tight text-foreground">
                      {project.totalRaised}
                    </p>
                  </div>
                </div>
              </div>

              {/* Funding progress */}
              <div className="px-6 mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Financiado</span>
                  <span className="font-medium text-foreground tabular-nums">{project.funded}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${project.funded}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs mt-2 text-muted-foreground">
                  <span>Inversión mínima: <span className="text-foreground font-medium">{project.minInvestment}</span></span>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-primary" />
                    <span>{project.capacity}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto border-t border-border/40 px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{project.investors} inversores</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{project.duration}</span>
                </div>
                <span className="text-foreground/50">Cerrado {project.completedAt}</span>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 pt-3">
                <Link href="/projects">
                  <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Ver proyectos similares
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
