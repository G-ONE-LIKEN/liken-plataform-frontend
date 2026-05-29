import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 sm:p-12 lg:p-16">
          {/* Background Effects */}
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
          
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Únete a la revolución energética
            </h2>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              Sé parte de los primeros inversores en obtener acceso exclusivo a proyectos de energía renovable. Regístrate ahora y recibe un bono de bienvenida.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/register">
                  Crear Cuenta Gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Sin comisiones ocultas. Cancela cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
