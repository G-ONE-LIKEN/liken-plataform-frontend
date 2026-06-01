"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: "radial-gradient(circle, oklch(0.38 0.012 240) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      {/* Fade mask over dot grid */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, var(--background) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Centered radial glow — draws eye to headline */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.13]"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.72 0.16 165), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">

        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0)}
          className="mb-10 text-xs font-semibold tracking-[0.1em] uppercase text-primary"
        >
          Energía tokenizada · Blockchain · Argentina
        </motion.p>

        {/* Headline — clip reveal per line */}
        <h1 className="text-6xl font-bold leading-[1.0] tracking-[-0.04em] text-foreground sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]">
          <div className="overflow-hidden">
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
          <div className="overflow-hidden">
            <motion.span
              className="block"
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
            className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
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
            className="border-border px-8 text-foreground hover:bg-secondary"
            asChild
          >
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mx-auto mt-14 flex max-w-sm justify-center gap-0 border-t border-border/60 pt-8 sm:max-w-none"
        >
          <div className="px-8 first:pl-0">
            <p className="text-2xl font-bold tabular-nums tracking-tight">$24M+</p>
            <p className="mt-1 text-xs tracking-wide text-muted-foreground">Activos tokenizados</p>
          </div>
          <div className="border-l border-border/60 px-8">
            <p className="text-2xl font-bold tabular-nums tracking-tight">12.5%</p>
            <p className="mt-1 text-xs tracking-wide text-muted-foreground">APY promedio</p>
          </div>
          <div className="border-l border-border/60 px-8">
            <p className="text-2xl font-bold tabular-nums tracking-tight">48</p>
            <p className="mt-1 text-xs tracking-wide text-muted-foreground">Proyectos activos</p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
