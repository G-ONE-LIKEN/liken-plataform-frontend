"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { z } from "zod";
import { apiClient, ApiClientError } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useSession } from "@/providers/session-provider";
import type { AuthLoginRequest, AuthLoginResponse } from "@/features/auth/types/auth";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import { parseSessionToken } from "@/features/auth/lib/session";

const loginSchema = z.object({
  email: z.string().email("Ingresa un email valido."),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres."),
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useSession();
  const [form, setForm] = useState<AuthLoginRequest>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof AuthLoginRequest, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const email = searchParams.get("email");
    if (!email) return;
    setForm((current) => (current.email === email ? current : { ...current, email }));
  }, [searchParams]);

  const finishLogin = useCallback((token: string) => {
    login(token);
    const parsed = parseSessionToken(token);
    const nextPath = searchParams.get("next") ?? "/dashboard";
    router.push(parsed.profileCompleted ? nextPath : `/complete-profile?next=${encodeURIComponent(nextPath)}`);
  }, [login, router, searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setUnverifiedEmail(null);

    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const response = await apiClient.post<AuthLoginResponse>("/api/auth/login", form);
      finishLogin(response.data.accessToken);
    } catch (error) {
      if (error instanceof ApiClientError && error.code === "EMAIL_NOT_VERIFIED") {
        setUnverifiedEmail(form.email);
      }
      setServerError(error instanceof Error ? error.message : "No se pudo iniciar sesion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleCredential = useCallback(async (idToken: string) => {
    setServerError(null);
    setUnverifiedEmail(null);
    const response = await apiClient.post<AuthLoginResponse>("/api/auth/google", { idToken });
    finishLogin(response.data.accessToken);
  }, [finishLogin]);

  const verificationSucceeded = searchParams.get("verified") === "1";

  return (
    <Card
      title="Ingresar"
      description="Usa tu cuenta de LIKEN para ver tu dashboard, proyectos, inversiones y wallet."
      className="w-full max-w-md"
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {verificationSucceeded && (
          <div className="rounded-xl border border-[rgba(38,116,88,0.3)] bg-[rgba(38,116,88,0.08)] px-4 py-3 text-sm text-[var(--color-success)]">
            Email verificado. Ya puedes iniciar sesion.
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={form.email}
          error={errors.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
        <div className="grid gap-1">
          <Input
            label="Contrasena"
            type="password"
            placeholder="********"
            value={form.password}
            error={errors.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <div className="text-right">
            <span className="cursor-not-allowed select-none text-xs text-[var(--color-foreground-subtle)]">
              Olvidaste tu contrasena?
            </span>
          </div>
        </div>
        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-[rgba(214,69,93,0.3)] bg-[rgba(214,69,93,0.08)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {serverError}
          </div>
        )}
        {unverifiedEmail && (
          <div className="rounded-xl border border-[rgba(31,111,84,0.25)] bg-[rgba(31,111,84,0.08)] px-4 py-4 text-sm text-[var(--color-foreground)]">
            <div className="flex items-start gap-3">
              <MailCheck className="mt-0.5 h-4 w-4 text-[var(--color-primary)]" />
              <div className="grid gap-3">
                <p>Tu cuenta aun no tiene el email verificado. Confirma el codigo para habilitar el acceso.</p>
                <Link
                  href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                  className="inline-flex w-fit items-center rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] transition hover:bg-[var(--color-primary-strong)]"
                >
                  Verificar email
                </Link>
              </div>
            </div>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Validando...
            </span>
          ) : (
            "Entrar a LIKEN"
          )}
        </Button>
        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[var(--color-foreground-subtle)]">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          o continua con
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <GoogleAuthButton onCredential={handleGoogleCredential} disabled={isSubmitting} />
      </form>
      <div className="mt-4 text-sm text-[var(--color-foreground-muted)]">
        Aun no tienes cuenta.{" "}
        <Link href="/register" className="font-semibold text-[var(--color-primary)]">
          Registrate
        </Link>
      </div>
    </Card>
  );
}
