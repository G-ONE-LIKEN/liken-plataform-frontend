"use client"

import { motion } from "framer-motion"
import { UserPlus, Search, CreditCard, TrendingUp } from "lucide-react"
import { gradientText } from "@/components/liken/atmosphere"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Creá tu cuenta",
    description: "Registro en minutos con tu correo. Verificación de identidad simple y segura.",
  },
  {
    icon: Search,
    step: "02",
    title: "Explorá proyectos",
    description: "Navegá el catálogo de parques solares y eólicos verificados en Argentina.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Invertí desde $10",
    description: "Elegí el monto y adquirí tokens $LKN respaldados por activos energéticos reales.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Recibí dividendos",
    description: "Cobros mensuales directamente en tu wallet, proporcionales a tu fracción del parque.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.72_0.16_165)]" />
            Proceso
          </p>
          <h2 className="max-w-lg text-3xl font-bold tracking-[-0.02em] text-foreground text-balance sm:text-4xl">
            Comenzá a invertir en 4 pasos
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            Diseñamos el proceso para que puedas empezar a generar rendimientos en minutos.
          </p>
        </motion.div>

        {/* Línea de "carga" que conecta los pasos (desktop) */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[2.4rem] hidden h-px bg-gradient-to-r from-primary/50 via-accent/50 to-primary/10 lg:block"
          />

          {/* Steps grid */}
          <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="group relative flex flex-col rounded-2xl border border-border/70 bg-card/70 p-7 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card"
              >
                {/* Step number */}
                <p className={`mb-4 text-5xl font-bold leading-none tracking-[-0.04em] tabular-nums ${gradientText()}`}>
                  {item.step}
                </p>

                {/* Icon */}
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/12 text-primary transition-colors group-hover:bg-primary/20">
                  <item.icon className="h-5 w-5" />
                </div>

                {/* Text */}
                <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
