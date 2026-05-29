import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { buttonStyles } from "@/shared/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-4xl rounded-[32px] border border-[var(--color-border)] bg-[var(--color-panel)] px-8 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:px-12 sm:py-16">
        <div className="text-center">
          <div className="text-[12px] font-semibold uppercase tracking-[0.34em] text-[var(--color-accent)]">
            Plataforma de inversion energetica
          </div>
          <h1 className="mt-6 text-6xl font-semibold tracking-[-0.08em] text-[var(--color-foreground)] sm:text-8xl">
            LIKEN
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[var(--color-foreground-muted)] sm:text-base">
            Invierte en proyectos de energia renovable con una experiencia simple, trazable y
            preparada para tokenizacion, dividendos y mercado secundario.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className={buttonStyles("primary", "min-w-44")}
            style={{ color: "#ffffff" }}
          >
            Iniciar sesion
          </Link>
          <Link href="/register" className={buttonStyles("secondary", "min-w-44")}>
            Registrarme
          </Link>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground-muted)] transition hover:text-[var(--color-foreground)]"
          >
            <Lock className="h-4 w-4" />
            Ingresar para ver proyectos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
