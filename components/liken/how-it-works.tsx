"use client"

import { motion } from "framer-motion"
import { UserPlus, Search, CreditCard, TrendingUp } from "lucide-react"

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
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-primary mb-3">
            Proceso
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl text-balance max-w-lg">
            Comenzá a invertir en 4 pasos
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xl">
            Diseñamos el proceso para que puedas empezar a generar rendimientos en minutos.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid gap-px bg-border/60 border border-border/60 rounded-lg overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="relative bg-card p-7 flex flex-col"
            >
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(100%+1px)] w-px h-0 border-t border-border/60 translate-x-0" />
              )}

              {/* Step number */}
              <p className="text-5xl font-bold tracking-[-0.04em] tabular-nums text-border/80 mb-4 leading-none">
                {item.step}
              </p>

              {/* Icon */}
              <div className="flex h-9 w-9 items-center justify-center rounded border border-primary/20 bg-primary/8 text-primary mb-5">
                <item.icon className="h-4.5 w-4.5" />
              </div>

              {/* Text */}
              <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
