"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, TrendingUp, Building2 } from "lucide-react";
import { z } from "zod";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

type Role = "INVESTOR" | "DEVELOPER";

const roles: { value: Role; label: string; description: string; icon: typeof TrendingUp }[] = [
  {
    value: "INVESTOR",
    label: "Inversor",
    description: "Quiero invertir en proyectos de energía renovable y recibir dividendos.",
    icon: TrendingUp,
  },
  {
    value: "DEVELOPER",
    label: "Desarrollador",
    description: "Quiero publicar proyectos energéticos. Requiere aprobación de LIKEN.",
    icon: Building2,
  },
]

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
  const [selectedRole, setSelectedRole] = useState<Role>("INVESTOR");
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
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
        roleName: selectedRole,
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

        {/* Role selector */}
        <div className="grid gap-2">
          <p className="text-xs font-medium text-[var(--color-foreground-subtle)] uppercase tracking-wide">Tipo de cuenta</p>
          <div className="grid grid-cols-2 gap-2">
            {roles.map(({ value, label, description, icon: Icon }) => {
              const active = selectedRole === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedRole(value)}
                  className={`flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-muted)]"
                  }`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface-raised)]"}`}>
                    <Icon className={`h-4 w-4 ${active ? "text-white" : "text-[var(--color-foreground-subtle)]"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${active ? "text-[var(--color-primary)]" : "text-[var(--color-foreground)]"}`}>
                      {label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-foreground-subtle)]">
                      {description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedRole === "DEVELOPER" && (
          <div className="rounded-xl border border-[rgba(250,180,50,0.3)] bg-[rgba(250,180,50,0.08)] px-4 py-3 text-sm text-yellow-500">
            Tu cuenta quedará <strong>pendiente de aprobación</strong>. Un administrador de LIKEN la revisará antes de que puedas publicar proyectos.
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
