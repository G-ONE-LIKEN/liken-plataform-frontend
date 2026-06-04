import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, MailCheck, ShieldCheck, Zap } from "lucide-react";
import { EmailVerificationForm } from "@/features/auth/components/email-verification-form";

const benefits = [
  { icon: MailCheck, text: "Activa el acceso a tu cuenta con un codigo de 6 digitos" },
  { icon: ShieldCheck, text: "Evita inicios de sesion con correos no confirmados" },
];

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al login
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">LIKEN</span>
          </div>

          <div>
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-primary">
              Verificacion
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Confirma tu correo
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Te enviamos un codigo para comprobar que el email realmente te pertenece antes de habilitar el acceso.
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
        </section>

        <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-xl bg-card" />}>
          <EmailVerificationForm />
        </Suspense>
      </div>
    </main>
  );
}
