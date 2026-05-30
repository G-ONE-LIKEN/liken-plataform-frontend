"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useSession } from "@/providers/session-provider";
import type { AuthLoginRequest, AuthLoginResponse } from "@/features/auth/types/auth";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

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
      login(response.data);
      const nextPath = searchParams.get("next") ?? "/dashboard";
      router.push(nextPath);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo iniciar sesion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card
      title="Ingresar"
      description="Usa tu cuenta de LIKEN para ver tu dashboard, proyectos, inversiones y wallet."
      className="w-full max-w-md"
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
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
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={form.password}
            error={errors.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <div className="text-right">
            <span className="cursor-not-allowed text-xs text-[var(--color-foreground-subtle)] select-none">
              ¿Olvidaste tu contraseña?
            </span>
          </div>
        </div>
        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-[rgba(214,69,93,0.3)] bg-[rgba(214,69,93,0.08)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {serverError}
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
      </form>
      <div className="mt-4 text-sm text-[var(--color-foreground-muted)]">
        Aún no tienes cuenta.{" "}
        <Link href="/register" className="font-semibold text-[var(--color-primary)]">
          Registrate
        </Link>
      </div>
    </Card>
  );
}
