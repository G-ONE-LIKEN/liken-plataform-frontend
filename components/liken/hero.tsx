"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { DotGrid, EnergyHalo, gradientText } from "@/components/liken/atmosphere"

// Expo-out: fast start, smooth landing — ideal for curtain reveals
const EXPO_OUT = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const reduced = useReducedMotion()

  // Clip reveal for headline lines — degrades to opacity-only when reduced motion
  const lineVariants = {
    hidden: reduced ? { opacity: 0 } : { y: "110%" },
    visible: reduced ? { opacity: 1 } : { y: 0 },
  }

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: EXPO_OUT },
  })

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Textura de grilla enmascarada */}
      <DotGrid />
      {/* Halo de energia esmeralda + ambar */}
      <EnergyHalo className="left-1/2 top-1/2 h-[640px] w-[1000px] -translate-x-1/2 -translate-y-1/2 opacity-90" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">

        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0)}
          className="mb-9 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-3.5 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase text-primary backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.72_0.16_165)]" />
          Energía tokenizada · Blockchain · Argentina
        </motion.p>

        {/* Headline — clip reveal per line */}
        <h1 className="text-6xl font-bold leading-[1.0] tracking-[-0.04em] text-foreground sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-balance">
          <div className="overflow-hidden pb-[0.12em]">
            <motion.span
              className="block"
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.78, delay: 0.18, ease: EXPO_OUT }}
            >
              Energía limpia.
            </motion.span>
          </div>
          <div className="overflow-hidden pb-[0.12em]">
            <motion.span
              className={`block ${gradientText()}`}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.78, delay: 0.30, ease: EXPO_OUT }}
            >
              Retornos reales.
            </motion.span>
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.72)}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Invertí en fracciones de parques solares y eólicos en Argentina.
          Dividendos mensuales, liquidez en el marketplace y trazabilidad on-chain.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.88)}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button
            size="lg"
            className="gap-2 bg-primary px-8 text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.72_0.16_165/0.8)] transition-shadow hover:bg-primary/90 hover:shadow-[0_10px_36px_-6px_oklch(0.72_0.16_165/0.95)]"
            asChild
          >
            <Link href="/register">
              Crear Cuenta Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border bg-card/40 px-8 text-foreground backdrop-blur-sm hover:bg-secondary"
            asChild
          >
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </motion.div>

        {/* Stats panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mx-auto mt-14 grid max-w-2xl grid-cols-3 overflow-hidden rounded-2xl border border-border/70 bg-card/50 backdrop-blur-md"
        >
          {[
            { value: "$24M+", label: "Activos tokenizados" },
            { value: "12.5%", label: "APY promedio", accent: true },
            { value: "48", label: "Proyectos activos" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`px-5 py-6 ${i > 0 ? "border-l border-border/60" : ""}`}
            >
              <p
                className={`text-2xl font-bold tabular-nums tracking-tight sm:text-3xl ${
                  stat.accent ? gradientText() : "text-foreground"
                }`}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-xs tracking-wide text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
