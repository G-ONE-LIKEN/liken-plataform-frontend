import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="space-y-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.34em] text-[var(--color-accent)]">
            Crear acceso
          </div>
          <h1 className="text-5xl font-semibold tracking-[-0.08em] text-[var(--color-foreground)] sm:text-7xl">
            LIKEN
          </h1>
          <p className="max-w-xl text-sm leading-7 text-[var(--color-foreground-muted)] sm:text-base">
            Crea tu cuenta para entrar al ecosistema de proyectos renovables y quedar listo para
            inversiones, wallet y dividendos.
          </p>
          <div className="text-sm text-[var(--color-foreground-muted)]">
            Ya tienes cuenta.{" "}
            <Link href="/login" className="font-semibold text-[var(--color-primary)]">
              Inicia sesion
            </Link>
          </div>
        </section>

        <RegisterForm />
      </div>
    </main>
  );
}
