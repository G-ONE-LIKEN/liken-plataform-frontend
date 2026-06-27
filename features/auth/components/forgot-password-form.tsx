"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AuthPanel } from "@/features/auth/components/auth-shell";

const emailSchema = z.string().email("Ingresa un email valido.");

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message ?? "Ingresa un email valido.");
      return;
    }
    setEmailError(null);
    setIsSubmitting(true);

    try {
      await apiClient.post("/api/auth/password-reset/request", { email: parsed.data });
      setSubmitted(true);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo enviar el codigo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <AuthPanel
        brandLabel="Recuperar contrasena"
        brandSubtitle="Revisa tu correo"
        heading="Codigo enviado"
        description="Si el email existe en nuestra plataforma, enviamos un codigo de 6 digitos. Revisa tu bandeja de entrada."
      >
        <div className="flex justify-center py-4">
          <CheckCircle2 className="h-12 w-12 text-[var(--color-primary)]" />
        </div>
        <Link
          href={`/reset-password?email=${encodeURIComponent(email)}`}
          className="block w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-center text-sm font-semibold text-[var(--color-primary-foreground)] transition hover:opacity-90"
        >
          Ingresar codigo
        </Link>
        <div className="mt-4 text-center text-sm text-[var(--color-foreground-muted)]">
          <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
            Volver al login
          </Link>
        </div>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel
      brandLabel="Recuperar contrasena"
      brandSubtitle="Te enviamos un codigo por email"
      heading="Olvidaste tu contrasena?"
      description="Ingresa tu email y te enviaremos un codigo para restablecer tu contrasena."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          value={email}
          error={emailError ?? undefined}
          onChange={(e) => setEmail(e.target.value)}
        />
        {serverError && (
          <div className="rounded-xl border border-[rgba(214,69,93,0.3)] bg-[rgba(214,69,93,0.08)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {serverError}
          </div>
        )}
        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
          ) : (
            "Enviar codigo"
          )}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm text-[var(--color-foreground-muted)]">
        <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
          Volver al login
        </Link>
      </div>
    </AuthPanel>
  );
}