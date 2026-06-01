"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-primary py-24">
      {/* Dot grid overlay — muy sutil sobre el verde */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.10 0.02 165) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />
      {/* Edge darkening */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, oklch(0.55 0.18 165 / 0.35) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-primary-foreground/60 mb-4">
            Acceso anticipado
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-primary-foreground sm:text-4xl lg:text-5xl text-balance">
            Comenzá tu inversión sostenible hoy
          </h2>
          <p className="mt-5 text-base text-primary-foreground/80 leading-relaxed max-w-lg mx-auto">
            Únete a los inversores que ya generan rendimientos mientras financian el futuro energético de Argentina.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
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
              className="px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50"
              asChild
            >
              <Link href="/login">Ya tengo cuenta</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-primary-foreground/60">
            Sin comisiones ocultas · Retirá cuando quieras · KYC en minutos
          </p>
        </motion.div>
      </div>
    </section>
  )
}
