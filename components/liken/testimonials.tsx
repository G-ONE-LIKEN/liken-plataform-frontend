"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Martín Rodríguez",
    role: "Inversor particular · Buenos Aires",
    initials: "MR",
    content:
      "Empecé con $500 hace 8 meses y ya recibí 8 pagos de dividendos puntuales. La transparencia on-chain me da una tranquilidad que no tenía con otros instrumentos.",
    rating: 5,
  },
  {
    name: "Lucía Fernández",
    role: "Lic. en Finanzas · Mendoza",
    initials: "LF",
    content:
      "Como profesional del sector me interesa la trazabilidad que ofrece LIKEN. Cada peso invertido tiene un respaldo físico verificable. Los rendimientos son reales y consistentes.",
    rating: 5,
  },
  {
    name: "Santiago Benítez",
    role: "Emprendedor · Córdoba",
    initials: "SB",
    content:
      "Diversifiqué parte de mi cartera en el Parque Patagónico y fue la mejor decisión del año. El marketplace me da liquidez real — pude vender una porción cuando la necesité.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-24 border-t border-border/40">
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
            Inversores
          </p>
          <h2 className="max-w-lg text-3xl font-bold tracking-[-0.02em] text-foreground text-balance sm:text-4xl">
            Lo que dicen quienes ya invierten
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="flex flex-col rounded-2xl border border-border/70 bg-card/70 p-7 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card"
            >
              <Quote className="mb-4 h-6 w-6 shrink-0 text-primary/30" />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                {t.content}
              </p>
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }, (_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
