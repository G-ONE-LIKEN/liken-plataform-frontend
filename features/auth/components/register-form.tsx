"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import type { AuthRegisterRequest } from "@/features/auth/types/auth";

const registerSchema = z
  .object({
    email: z.string().email("Ingresa un email valido."),
    password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirma la contrasena."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden.",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<AuthRegisterRequest>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AuthRegisterRequest, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await apiClient.post("/api/users", {
        email: form.email,
        password: form.password,
      });
      setSuccessMessage("Cuenta creada. Ya puedes iniciar sesion en LIKEN.");
      setForm({ email: "", password: "", confirmPassword: "" });
      window.setTimeout(() => router.push("/login"), 900);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo crear la cuenta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card
      title="Crear cuenta"
      description="Entra a LIKEN con una cuenta propia para explorar proyectos, seguir inversiones y preparar tu wallet."
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
        <Input
          label="Contrasena"
          type="password"
          placeholder="Minimo 6 caracteres"
          value={form.password}
          error={errors.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        />
        <Input
          label="Confirmar contrasena"
          type="password"
          placeholder="Repite la contrasena"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
        />

        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-[rgba(214,69,93,0.3)] bg-[rgba(214,69,93,0.08)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-[rgba(38,116,88,0.3)] bg-[rgba(38,116,88,0.08)] px-4 py-3 text-sm text-[var(--color-success)]">
            {successMessage}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creando cuenta...
            </span>
          ) : (
            "Registrarme"
          )}
        </Button>
      </form>

      <div className="mt-4 text-sm text-[var(--color-foreground-muted)]">
        Ya tienes cuenta.{" "}
        <Link href="/login" className="font-semibold text-[var(--color-primary)]">
          Iniciar sesion
        </Link>
      </div>
    </Card>
  );
}
