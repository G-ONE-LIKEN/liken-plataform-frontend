import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { Card } from "@/shared/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="space-y-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.34em] text-[var(--color-accent)]">
            LIKEN Access
          </div>
          <h1 className="text-5xl font-semibold tracking-[-0.08em] text-[var(--color-foreground)] sm:text-7xl">
            LIKEN
          </h1>
          <p className="max-w-xl text-sm leading-7 text-[var(--color-foreground-muted)] sm:text-base">
            Una entrada simple para explorar proyectos, seguir inversiones y operar con tu cuenta
            desde un entorno claro y profesional.
          </p>
          <div className="text-sm text-[var(--color-foreground-muted)]">
            No tienes cuenta.{" "}
            <Link href="/register" className="font-semibold text-[var(--color-primary)]">
              Registrate aqui
            </Link>
          </div>
        </section>

        <Suspense
          fallback={
            <Card
              title="Cargando acceso"
              description="Preparando formulario y redireccion segura de sesion."
              className="w-full max-w-md"
            />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
