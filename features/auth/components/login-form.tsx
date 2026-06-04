"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Loader2, MailCheck, Zap } from "lucide-react";
import { z } from "zod";
import { apiClient, ApiClientError } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="relative w-full max-w-md">
      {/* Halo de energia detras del panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px -z-10 rounded-[1.6rem] opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, oklch(0.72 0.16 165 / 0.20), transparent 55%), radial-gradient(120% 90% at 100% 100%, oklch(0.80 0.12 85 / 0.16), transparent 55%)",
        }}
      />

      <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-panel)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />

        <div className="p-6 sm:p-8">
          <header className="mb-7 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] shadow-[0_0_24px_-4px_oklch(0.72_0.16_165/0.7)]">
              <Zap className="h-5 w-5 text-[var(--color-primary-foreground)]" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-[var(--color-foreground)]">Ingresar</p>
              <p className="text-[11px] text-[var(--color-foreground-subtle)]">Dashboard · proyectos · wallet</p>
            </div>
          </header>

          <h2 className="mb-1 text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
            Bienvenido de nuevo
          </h2>
          <p className="mb-6 text-sm text-[var(--color-foreground-muted)]">
            Usa tu cuenta de LIKEN para retomar tus inversiones.
          </p>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            {verificationSucceeded && (
              <div className="flex items-center gap-3 rounded-xl border border-[rgba(38,116,88,0.3)] bg-[rgba(38,116,88,0.08)] px-4 py-3 text-sm text-[var(--color-success)]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Email verificado. Ya puedes iniciar sesion.
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              value={form.email}
              error={errors.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
            <div className="grid gap-1.5">
              <Input
                label="Contrasena"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                autoComplete="current-password"
                value={form.password}
                error={errors.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-foreground-subtle)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
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
            <Button type="submit" className="h-11 w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  Entrar a LIKEN
                  <Zap className="h-4 w-4" />
                </>
              )}
            </Button>
            <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[var(--color-foreground-subtle)]">
              <span className="h-px flex-1 bg-[var(--color-border)]" />
              o continua con
              <span className="h-px flex-1 bg-[var(--color-border)]" />
            </div>
            <GoogleAuthButton onCredential={handleGoogleCredential} disabled={isSubmitting} />
          </form>

          <div className="mt-6 border-t border-[var(--color-border)] pt-5 text-sm text-[var(--color-foreground-muted)]">
            Aun no tienes cuenta.{" "}
            <Link href="/register" className="font-semibold text-[var(--color-primary)] hover:underline">
              Registrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
