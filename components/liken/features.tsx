"use client"

import { motion } from "framer-motion"
import { Coins, Lock, BarChart3, Globe, Zap, FileCheck } from "lucide-react"
import { GradientBar, gradientText } from "@/components/liken/atmosphere"

const cardBase =
  "group relative flex flex-col rounded-2xl border border-border/70 bg-card/70 p-7 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card"

const iconTile =
  "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary border border-primary/20 transition-colors group-hover:bg-primary/20"

export function Features() {
  return (
    <section id="como-funciona" className="relative py-24 border-t border-border/40">
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
            Cómo funciona
          </p>
          <h2 className="max-w-xl text-3xl font-bold tracking-[-0.02em] text-foreground text-balance sm:text-4xl">
            Inversión en energía simplificada
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            LIKEN democratiza el acceso a infraestructura energética mediante blockchain.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* 1. Tokenización — large, spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className={`${cardBase} overflow-hidden lg:col-span-2`}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(circle, oklch(0.72 0.16 165 / 0.35), transparent 70%)" }}
            />
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_24px_-4px_oklch(0.72_0.16_165/0.7)]">
                <Coins className="h-5 w-5" />
              </div>
              <span className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-xs font-medium tracking-wide text-primary">
                Principal beneficio
              </span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Tokenización de Activos</h3>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Convierte activos energéticos en tokens fraccionados. Invierte en proyectos de alto valor desde pequeñas cantidades.
            </p>
            <div className="mt-auto">
              <div className="mb-2 flex flex-wrap gap-1">
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 rounded-sm ${i < 4 ? "bg-primary shadow-[0_0_6px_-1px_oklch(0.72_0.16_165)]" : "bg-border/80"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">4 de 30 tokens · tu fracción del parque</p>
              <p className="mt-3 text-3xl font-bold tracking-[-0.02em] tabular-nums text-foreground">
                Desde $10
              </p>
            </div>
          </motion.div>

          {/* 2. Seguridad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className={cardBase}
          >
            <div className={`${iconTile} mb-6`}>
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Seguridad Blockchain</h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Contratos inteligentes auditados. La inmutabilidad de la blockchain protege cada inversión.
            </p>
            <div className="mt-auto space-y-2">
              {["Smart contracts auditados", "Transparencia on-chain", "Fondos no custodiales"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3. Rendimientos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className={cardBase}
          >
            <div className={`${iconTile} mb-6`}>
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Rendimientos Transparentes</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Monitorea en tiempo real. Sin comisiones ocultas ni intermediarios.
            </p>
            <div className="mt-auto">
              <p className={`text-4xl font-bold tracking-[-0.02em] tabular-nums ${gradientText()}`}>12.5%</p>
              <p className="mt-1 text-xs tracking-wide text-muted-foreground">APY promedio histórico</p>
            </div>
          </motion.div>

          {/* 4. Liquidez */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className={cardBase}
          >
            <div className={`${iconTile} mb-6`}>
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Liquidez Instantánea</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Marketplace descentralizado. Comprá y vendé tokens de energía sin plazos fijos.
            </p>
            <div className="mt-auto">
              <p className="text-4xl font-bold tracking-[-0.02em] text-foreground">24/7</p>
              <p className="mt-1 text-xs tracking-wide text-muted-foreground">Marketplace activo</p>
            </div>
          </motion.div>

          {/* 5. Impacto Global */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className={cardBase}
          >
            <div className={`${iconTile} mb-6`}>
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Impacto Global</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Contribuí a la transición energética mientras generás rendimientos competitivos.
            </p>
            <div className="mt-auto">
              <p className="text-4xl font-bold tracking-[-0.02em] text-foreground">48</p>
              <p className="mt-1 text-xs tracking-wide text-muted-foreground">Proyectos verdes activos</p>
            </div>
          </motion.div>

          {/* 6. Cumplimiento — full width strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 px-7 py-5 lg:col-span-3"
          >
            <GradientBar className="absolute inset-x-0 top-0 opacity-80" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                  <FileCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Cumplimiento Regulatorio</span>
                  <span className="mx-3 text-border">·</span>
                  <span className="text-sm text-muted-foreground">
                    Operamos bajo estándares regulatorios internacionales para proteger tu inversión.
                  </span>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-border/60 px-3 py-1.5 text-xs tracking-wide text-muted-foreground">
                Regulado · KYC/AML
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
