import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { Zap, TrendingUp, ShieldCheck, BarChart3 } from "lucide-react";

const benefits = [
  { icon: TrendingUp, text: "Monitoreá el rendimiento de tus inversiones en tiempo real" },
  { icon: ShieldCheck, text: "Tu portafolio protegido con seguridad blockchain" },
  { icon: BarChart3, text: "Operá en el marketplace y gestioná tus dividendos" },
]

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">

        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">LIKEN</span>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.34em] text-primary mb-3">
              Iniciar sesión
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Tu portafolio te espera
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Ingresá a tu cuenta y accedé a tus inversiones, rendimientos y operaciones en el ecosistema LIKEN.
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
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Registrate gratis
            </Link>
          </div>
        </section>

        <Suspense fallback={<div className="h-80 w-full animate-pulse rounded-xl bg-card" />}>
          <LoginForm />
        </Suspense>

      </div>
    </main>
  );
}
