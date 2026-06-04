"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, RefreshCcw } from "lucide-react";
import { z } from "zod";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emailSchema = z.string().email("Ingresa un email valido.");

export function EmailVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const fromRegister = searchParams.get("from") === "register";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(fromRegister ? 60 : 0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const cooldownLabel = useMemo(() => {
    if (cooldown <= 0) return "Reenviar codigo";
    return `Reenviar en ${cooldown}s`;
  }, [cooldown]);

  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
      setEmailError(parsedEmail.error.issues[0]?.message ?? "Ingresa un email valido.");
      return;
    }
    setEmailError(null);

    if (!/^\d{6}$/.test(code)) {
      setServerError("Ingresa el codigo completo de 6 digitos.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/api/auth/email-verification/confirm", {
        email: parsedEmail.data,
        code,
      });
      setSuccessMessage("Email verificado correctamente. Redirigiendo al login...");
      window.setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(parsedEmail.data)}&verified=1`);
      }, 900);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo verificar el email.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setServerError(null);
    setSuccessMessage(null);

    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
      setEmailError(parsedEmail.error.issues[0]?.message ?? "Ingresa un email valido.");
      return;
    }
    setEmailError(null);

    setIsResending(true);
    try {
      await apiClient.post("/api/auth/email-verification/resend", {
        email: parsedEmail.data,
      });
      setCooldown(60);
      setSuccessMessage("Enviamos un nuevo codigo de verificacion a tu email.");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo reenviar el codigo.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <Card
      title="Verifica tu email"
      description="Ingresa el codigo de 6 digitos que enviamos a tu correo para habilitar el inicio de sesion."
      className="w-full max-w-md"
    >
      <form className="grid gap-5" onSubmit={handleConfirm}>
        <Input
          label="Email"
          type="email"
          value={email}
          error={emailError ?? undefined}
          onChange={(event) => setEmail(event.target.value)}
        />

        <div className="grid gap-3">
          <label className="text-sm font-medium text-[var(--color-foreground)]">Codigo de verificacion</label>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.025)] px-3 py-4 sm:px-4">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              containerClassName="justify-center"
            >
              <InputOTPGroup className="justify-center">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-xs text-[var(--color-foreground-subtle)]">
            El codigo vence en 10 minutos.
          </p>
        </div>

        {serverError && (
          <div className="rounded-lg border border-[rgba(214,69,93,0.3)] bg-[rgba(214,69,93,0.08)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg border border-[rgba(38,116,88,0.3)] bg-[rgba(38,116,88,0.08)] px-4 py-3 text-sm text-[var(--color-success)]">
            {successMessage}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando...
            </span>
          ) : (
            "Confirmar email"
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={isResending || cooldown > 0}
          onClick={handleResend}
        >
          {isResending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Reenviando...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              {cooldownLabel}
            </span>
          )}
        </Button>
      </form>

      <div className="mt-4 text-sm text-[var(--color-foreground-muted)]">
        Ya verificaste tu cuenta?{" "}
        <Link href={`/login?email=${encodeURIComponent(email)}`} className="font-semibold text-[var(--color-primary)]">
          Ir al login
        </Link>
      </div>
    </Card>
  );
}
