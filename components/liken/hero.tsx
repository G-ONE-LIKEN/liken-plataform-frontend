import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, TrendingUp, Leaf } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Blockchain · Energía · Inversiones
          </div>

          {/* Main Heading */}
          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Invierte en el Futuro de la{" "}
            <span className="text-primary">Energía Limpia</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Tokeniza tus inversiones en campos de energía renovable. Accede a activos energéticos de alto rendimiento con la seguridad y transparencia de blockchain.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/register">
                Crear Cuenta Gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border px-8 text-foreground hover:bg-secondary" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <TrendingUp className="mb-3 h-8 w-8 text-primary" />
              <span className="text-3xl font-bold text-foreground">$24M+</span>
              <span className="text-sm text-muted-foreground">Activos Tokenizados</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <Shield className="mb-3 h-8 w-8 text-primary" />
              <span className="text-3xl font-bold text-foreground">12.5%</span>
              <span className="text-sm text-muted-foreground">APY Promedio</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <Leaf className="mb-3 h-8 w-8 text-primary" />
              <span className="text-3xl font-bold text-foreground">48</span>
              <span className="text-sm text-muted-foreground">Proyectos Activos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
