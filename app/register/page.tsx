import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/register-form";
import { Zap, TrendingUp, Leaf, Wallet } from "lucide-react";

const benefits = [
  { icon: Leaf, text: "Invertí en proyectos reales de energía solar, eólica e hídrica" },
  { icon: TrendingUp, text: "Rendimientos anuales estimados de hasta 15% APY" },
  { icon: Wallet, text: "Operá con USDC y recibí dividendos en tokens LKN" },
]

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_640px] lg:items-center">
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">LIKEN</span>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.34em] text-primary mb-3">
              Crear cuenta
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
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

        <RegisterForm />
      </div>
    </main>
  );
}
