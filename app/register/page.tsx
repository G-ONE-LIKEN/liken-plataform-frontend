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
    <main className="relative min-h-screen overflow-hidden px-6 lg:px-0">
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

      <div className="mx-auto grid w-full max-w-6xl lg:min-h-screen lg:grid-cols-[1fr_640px]">

        {/* Left — sticky marketing panel */}
        <section className="flex flex-col justify-center gap-6 py-12 lg:sticky lg:top-0 lg:h-screen lg:py-16 lg:pr-12">
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
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-primary">
              Crear cuenta
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
              Empezá a invertir{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                en energía limpia
              </span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Creá tu cuenta gratuita y accedé al ecosistema de proyectos de energía renovable tokenizados en blockchain.
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
            Ya tenés cuenta.{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Iniciar sesión
            </Link>
          </div>
        </section>

        {/* Right — scrollable form */}
        <div className="flex flex-col justify-center py-12 lg:min-h-screen lg:px-12 lg:py-16">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <RegisterForm />
          </div>
        </div>

      </div>
    </main>
  );
}
