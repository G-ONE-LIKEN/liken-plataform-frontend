import Link from "next/link"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Sistema visual compartido de la landing — alineado con el rediseno de auth:
 * halos de energia (esmeralda + ambar), grilla enmascarada, barra superior degradada
 * y marca con el rayo en caja redondeada con glow.
 */

/** Halo doble (esmeralda arriba-izq, ambar abajo-der). Decorativo, no interactivo. */
export function EnergyHalo({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute -z-10 blur-3xl", className)}
      style={{
        background:
          "radial-gradient(60% 60% at 0% 0%, oklch(0.72 0.16 165 / 0.20), transparent 60%), radial-gradient(55% 55% at 100% 100%, oklch(0.80 0.12 85 / 0.14), transparent 60%)",
      }}
    />
  )
}

/** Grilla de puntos sutil con mascara radial para dar textura sin ruido. */
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 opacity-[0.5]", className)}
      style={{
        backgroundImage: "radial-gradient(circle, oklch(0.40 0.012 240) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        maskImage: "radial-gradient(ellipse 75% 60% at 50% 40%, black, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 40%, black, transparent 80%)",
      }}
    />
  )
}

/** Barra superior degradada esmeralda -> ambar -> esmeralda. Firma de panel. */
export function GradientBar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-1 w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]",
        className,
      )}
    />
  )
}

/** Marca LIKEN: rayo en caja redondeada esmeralda con glow + wordmark. */
export function BrandMark({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const box =
    size === "lg" ? "h-11 w-11 rounded-2xl" : size === "sm" ? "h-7 w-7 rounded-lg" : "h-9 w-9 rounded-xl"
  const icon = size === "lg" ? "h-6 w-6" : size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5"
  const word =
    size === "lg" ? "text-xl" : size === "sm" ? "text-sm tracking-[0.14em]" : "text-lg"

  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex items-center justify-center bg-primary text-primary-foreground transition-shadow",
          "shadow-[0_0_24px_-4px_oklch(0.72_0.16_165/0.7)] group-hover:shadow-[0_0_30px_-2px_oklch(0.72_0.16_165/0.9)]",
          box,
        )}
      >
        <Zap className={icon} />
      </span>
      <span className={cn("font-bold tracking-tight text-foreground uppercase", word)}>LIKEN</span>
    </Link>
  )
}

/** Texto con degradado esmeralda -> ambar para frases clave. */
export function gradientText() {
  return "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent"
}
