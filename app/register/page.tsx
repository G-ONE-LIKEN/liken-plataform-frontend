import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/register-form";
import { Zap, TrendingUp, Leaf, Wallet, ArrowLeft } from "lucide-react";

const benefits = [
  { icon: Leaf, text: "Invertí en proyectos reales de energía solar, eólica e hídrica" },
  { icon: TrendingUp, text: "Rendimientos anuales estimados de hasta 15% APY" },
  { icon: Wallet, text: "Operá con USDC y recibí dividendos en tokens LKN" },
]

export default function RegisterPage() {
  return (
    <main className="min-h-screen px-6 lg:px-0">
      <div className="mx-auto grid w-full max-w-6xl lg:min-h-screen lg:grid-cols-[1fr_620px]">

        {/* Left — sticky marketing panel */}
        <section className="flex flex-col justify-center gap-6 py-12 lg:sticky lg:top-0 lg:h-screen lg:py-16 lg:pr-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al inicio
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">LIKEN</span>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-primary mb-3">
              Crear cuenta
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl text-balance">
              Empezá a invertir hoy
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Creá tu cuenta gratuita y accedé al ecosistema de proyectos de energía renovable tokenizados en blockchain.
            </p>
          </div>

          <ul className="space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>

          <div className="text-sm text-muted-foreground">
            Ya tenés cuenta.{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Iniciar sesión
            </Link>
          </div>
        </section>

        {/* Right — scrollable form */}
        <div className="flex flex-col justify-center py-12 lg:min-h-screen lg:px-12 lg:py-16">
          <RegisterForm />
        </div>

      </div>
    </main>
  );
}
