"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useSession } from "@/providers/session-provider";

type ProfileForm = {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  phone: string;
  country: string;
  province: string;
  address: string;
  termsAccepted: boolean;
};

const profileSchema = z.object({
  firstName: z.string().min(2, "Ingresa tu nombre."),
  lastName: z.string().min(2, "Ingresa tu apellido."),
  dni: z.string().regex(/^[0-9.\s-]{7,14}$/, "Ingresa un DNI valido."),
  birthDate: z.string().min(1, "Ingresa tu fecha de nacimiento."),
  phone: z.string().min(6, "Ingresa un telefono valido."),
  country: z.string().min(2, "Ingresa tu pais."),
  province: z.string().min(2, "Ingresa tu provincia."),
  address: z.string().min(4, "Ingresa tu direccion."),
  termsAccepted: z.literal(true, {
    error: "Debes aceptar los terminos y condiciones.",
  }),
}).refine((data) => {
  const value = new Date(`${data.birthDate}T00:00:00`);
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() - 18);
  return value <= limit;
}, {
  message: "Debes ser mayor de 18 anos para registrarte.",
  path: ["birthDate"],
});

export function CompleteProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshContext } = useSession();
  const [form, setForm] = useState<ProfileForm>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    dni: "",
    birthDate: "",
    phone: "",
    country: "Argentina",
    province: "",
    address: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        dni: fieldErrors.dni?.[0],
        birthDate: fieldErrors.birthDate?.[0],
        phone: fieldErrors.phone?.[0],
        country: fieldErrors.country?.[0],
        province: fieldErrors.province?.[0],
        address: fieldErrors.address?.[0],
        termsAccepted: fieldErrors.termsAccepted?.[0],
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await apiClient.put("/api/users/me/profile", form);
      await refreshContext();
      router.replace(searchParams.get("next") ?? "/dashboard");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo actualizar el perfil.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card
      title="Completar perfil"
      description="Necesitamos estos datos para habilitar tu cuenta profesional en LIKEN."
      className="w-full max-w-2xl"
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <section className="grid gap-3">
          <p className="text-sm font-semibold text-[var(--color-foreground)]">Identidad</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Nombre" value={form.firstName} error={errors.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
            <Input label="Apellido" value={form.lastName} error={errors.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
            <Input label="DNI" inputMode="numeric" value={form.dni} error={errors.dni} onChange={(event) => updateField("dni", event.target.value)} />
            <Input label="Fecha de nacimiento" type="date" value={form.birthDate} error={errors.birthDate} onChange={(event) => updateField("birthDate", event.target.value)} />
            <Input label="Telefono" value={form.phone} error={errors.phone} onChange={(event) => updateField("phone", event.target.value)} />
          </div>
        </section>

        <section className="grid gap-3">
          <p className="text-sm font-semibold text-[var(--color-foreground)]">Contacto</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Pais" value={form.country} error={errors.country} onChange={(event) => updateField("country", event.target.value)} />
            <Input label="Provincia" value={form.province} error={errors.province} onChange={(event) => updateField("province", event.target.value)} />
            <Input label="Direccion" className="sm:col-span-2" value={form.address} error={errors.address} onChange={(event) => updateField("address", event.target.value)} />
          </div>
        </section>

        <label className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-foreground-muted)]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-[var(--color-border)]"
            checked={form.termsAccepted}
            onChange={(event) => updateField("termsAccepted", event.target.checked)}
          />
          <span>Acepto los terminos, condiciones y el tratamiento de datos necesario para operar en LIKEN.</span>
        </label>
        {errors.termsAccepted && <p className="text-xs text-[var(--color-danger)]">{errors.termsAccepted}</p>}

        {serverError && (
          <div className="rounded-lg border border-[rgba(214,69,93,0.3)] bg-[rgba(214,69,93,0.08)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {serverError}
          </div>
        )}

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </span>
          ) : (
            "Completar perfil"
          )}
        </Button>
      </form>
    </Card>
  );
}
