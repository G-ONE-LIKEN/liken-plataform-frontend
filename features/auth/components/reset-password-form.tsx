"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthPanel } from "@/features/auth/components/auth-shell";

const schema = z.object({
  code: z.string().regex(/^\d{6}$/, "El codigo debe tener 6 digitos."),
  newPassword: z.string().min(6, "La contrasena debe tener al menos 6 caracteres."),
});

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const parsed = schema.safeParse({ code, newPassword });
    if (!parsed.success) {
      setServerError(parsed.error.issues[0]?.message ?? "Datos invalidos.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/api/auth/password-reset/confirm", {
        email,
        code,
        newPassword,
      });
      router.push(`/login?email=${encodeURIComponent(email)}&reset=1`);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo restablecer la contrasena.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPanel
      brandLabel="Recuperar contrasena"
      brandSubtitle="Ingresa el codigo recibido"
      heading="Restablecer contrasena"
      description="Ingresa el codigo de 6 digitos que enviamos a tu email y tu nueva contrasena."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-3">
          <label className="text-sm font-medium text-[var(--color-foreground)]">
            Codigo de verificacion
          </label>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-4 sm:px-4">
            <InputOTP maxLength={6} value={code} onChange={setCode} containerClassName="justify-center">
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
        </div>

        <Input
          label="Nueva contrasena"
          type={showPassword ? "text" : "password"}
          placeholder="********"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-foreground-subtle)] transition-colors hover:text-[var(--color-foreground)]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        {serverError && (
          <div className="rounded-xl border border-[rgba(214,69,93,0.3)] bg-[rgba(214,69,93,0.08)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {serverError}
          </div>
        )}

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting || code.length < 6}>
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Actualizando...</>
          ) : (
            "Restablecer contrasena"
          )}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-[var(--color-foreground-muted)]">
        <Link href="/forgot-password" className="font-semibold text-[var(--color-primary)] hover:underline">
          Reenviar codigo
        </Link>
      </div>
    </AuthPanel>
  );
}