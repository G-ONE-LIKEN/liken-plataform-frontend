"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
          placeholder="admin@admin.com"
          value={form.email}
          error={errors.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
        <Input
          label="Contrasena"
          type="password"
          placeholder="******"
          value={form.password}
          error={errors.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        />
        {serverError && (
          <div className="rounded-md bg-[rgba(214,69,93,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {serverError}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Validando credenciales..." : "Entrar a LIKEN"}
        </Button>
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
