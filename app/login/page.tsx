import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { CheckCircle, Zap } from "lucide-react";

const benefits = [
  "Accedé a proyectos de energía solar, eólica e hidroeléctrica",
  "Seguí el rendimiento de tus inversiones en tiempo real",
  "Operá con USDC y tokens LKN desde tu wallet",
]

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-background">
      {/* Left panel */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-card p-12 lg:flex">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">LIKEN</span>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Tu portafolio{" "}
            <span className="text-primary">te espera</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Iniciá sesión para ver tus inversiones, monitorear rendimientos y operar en el marketplace de energía renovable.
          </p>

          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-muted-foreground">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Registrate gratis
          </Link>
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:max-w-md">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">LIKEN</span>
        </div>

        <Suspense fallback={<div className="h-80 w-full max-w-md animate-pulse rounded-xl bg-card" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
