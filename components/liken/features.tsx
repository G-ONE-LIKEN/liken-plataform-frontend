"use client"

import { motion } from "framer-motion"
import { Coins, Lock, BarChart3, Globe, Zap, FileCheck } from "lucide-react"

export function Features() {
  return (
    <section id="como-funciona" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-primary mb-3">
            Cómo funciona
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl text-balance max-w-xl">
            Inversión en energía simplificada
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xl">
            LIKEN democratiza el acceso a infraestructura energética mediante blockchain.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid gap-px bg-border/60 border border-border/60 rounded-lg overflow-hidden lg:grid-cols-3">

          {/* 1. Tokenización — large, spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="col-span-1 bg-card p-7 flex flex-col lg:col-span-2"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20">
                <Coins className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground border border-border px-2 py-1 rounded-sm tracking-wide">
                Principal beneficio
              </span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Tokenización de Activos</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
              Convierte activos energéticos en tokens fraccionados. Invierte en proyectos de alto valor desde pequeñas cantidades.
            </p>
            <div className="mt-auto">
              <div className="flex gap-1 flex-wrap mb-2">
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 rounded-sm ${i < 4 ? "bg-primary" : "bg-border/80"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">4 de 30 tokens · tu fracción del parque</p>
              <p className="text-3xl font-bold tracking-[-0.02em] tabular-nums text-foreground mt-3">
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
            className="col-span-1 bg-card p-7 flex flex-col"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 mb-6">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Seguridad Blockchain</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Contratos inteligentes auditados. La inmutabilidad de la blockchain protege cada inversión.
            </p>
            <div className="mt-auto space-y-2">
              {["Smart contracts auditados", "Transparencia on-chain", "Fondos no custodiales"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
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
            className="col-span-1 bg-card p-7 flex flex-col"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 mb-6">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Rendimientos Transparentes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Monitorea en tiempo real. Sin comisiones ocultas ni intermediarios.
            </p>
            <div className="mt-auto">
              <p className="text-4xl font-bold tracking-[-0.02em] tabular-nums text-primary">12.5%</p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">APY promedio histórico</p>
            </div>
          </motion.div>

          {/* 4. Liquidez */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="col-span-1 bg-card p-7 flex flex-col"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 mb-6">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Liquidez Instantánea</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Marketplace descentralizado. Comprá y vendé tokens de energía sin plazos fijos.
            </p>
            <div className="mt-auto">
              <p className="text-4xl font-bold tracking-[-0.02em] text-foreground">24/7</p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">Marketplace activo</p>
            </div>
          </motion.div>

          {/* 5. Impacto Global */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="col-span-1 bg-card p-7 flex flex-col"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 mb-6">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Impacto Global</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Contribuí a la transición energética mientras generás rendimientos competitivos.
            </p>
            <div className="mt-auto">
              <p className="text-4xl font-bold tracking-[-0.02em] text-foreground">48</p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">Proyectos verdes activos</p>
            </div>
          </motion.div>

          {/* 6. Cumplimiento — full width strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="col-span-1 bg-card/60 px-7 py-5 lg:col-span-3"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground border border-border">
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
              <span className="text-xs text-muted-foreground border border-border/60 px-3 py-1.5 rounded-sm shrink-0 tracking-wide">
                Regulado · KYC/AML
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
