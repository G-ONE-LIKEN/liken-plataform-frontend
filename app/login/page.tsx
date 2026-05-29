import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { Shield, TrendingUp, Leaf, Zap } from "lucide-react";

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
            Invierte en el futuro de la{" "}
            <span className="text-primary">Energía Limpia</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Tokenizá tus inversiones en proyectos de energía renovable con la seguridad y transparencia de blockchain.
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border/50 bg-background/50 p-4 text-center">
              <TrendingUp className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="text-lg font-bold text-foreground">12.5%</p>
              <p className="text-xs text-muted-foreground">APY Promedio</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-4 text-center">
              <Shield className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="text-lg font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground">Auditado</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-4 text-center">
              <Leaf className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="text-lg font-bold text-foreground">48</p>
              <p className="text-xs text-muted-foreground">Proyectos</p>
            </div>
          </div>
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
