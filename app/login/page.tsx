import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { Zap, TrendingUp, ShieldCheck, BarChart3, ArrowLeft } from "lucide-react";

const benefits = [
  { icon: TrendingUp, text: "Monitoreá el rendimiento de tus inversiones en tiempo real" },
  { icon: ShieldCheck, text: "Tu portafolio protegido con seguridad blockchain" },
  { icon: BarChart3, text: "Operá en el marketplace y gestioná tus dividendos" },
]

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      {/* Atmósfera energética del fondo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 12% 8%, oklch(0.72 0.16 165 / 0.16), transparent 60%), radial-gradient(55% 50% at 95% 100%, oklch(0.80 0.12 85 / 0.12), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at 50% 30%, black, transparent 75%)",
        }}
      />

      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">

        <section className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al inicio
          </Link>

          <div className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-3 duration-500">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-[0_0_28px_-6px_oklch(0.72_0.16_165/0.8)]">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">LIKEN</span>
          </div>

          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-primary">
              Iniciar sesión
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Tu portafolio{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                te espera
              </span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Ingresá a tu cuenta y accedé a tus inversiones, rendimientos y operaciones en el ecosistema LIKEN.
            </p>
          </div>

          <ul className="space-y-3.5">
            {benefits.map(({ icon: Icon, text }, i) => (
              <li
                key={text}
                className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4"
                style={{ animationDuration: "700ms", animationDelay: `${150 + i * 120}ms`, animationFillMode: "both" }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>

          <div className="text-sm text-muted-foreground animate-in fade-in duration-1000">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Registrate gratis
            </Link>
          </div>
        </section>

        <Suspense fallback={<div className="h-80 w-full animate-pulse rounded-[1.5rem] bg-card" />}>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <LoginForm />
          </div>
        </Suspense>

      </div>
    </main>
  );
}
