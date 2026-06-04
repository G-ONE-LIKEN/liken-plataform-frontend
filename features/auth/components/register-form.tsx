"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, Loader2, TrendingUp } from "lucide-react";
import { z } from "zod";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { getPasswordStrength } from "@/shared/lib/password-strength";
import { Input } from "@/shared/ui/input";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import { parseSessionToken } from "@/features/auth/lib/session";
import { useSession } from "@/providers/session-provider";
import type { AuthLoginResponse, AuthRegisterRequest } from "@/features/auth/types/auth";

type Role = "INVESTOR" | "DEVELOPER";
const passwordRuleMessage = "La contrasena debe tener al menos 6 caracteres, una letra, un numero y un caracter especial.";
const dniRuleMessage = "Ingresa un DNI valido.";
const passwordRuleHint = "Usa al menos 6 caracteres con una letra, un numero y un caracter especial.";
const dniRuleRegex = /^[0-9.\s-]{7,14}$/;
const passwordRuleRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;
const sensitiveFields = ["dni", "password", "confirmPassword"] as const;

type SensitiveField = (typeof sensitiveFields)[number];

const roles: { value: Role; label: string; description: string; icon: typeof TrendingUp }[] = [
  {
    value: "INVESTOR",
    label: "Inversor",
    description: "Invertir en proyectos de energia renovable y recibir dividendos.",
    icon: TrendingUp,
  },
  {
    value: "DEVELOPER",
    label: "Desarrollador",
    description: "Publicar proyectos energeticos con aprobacion de LIKEN.",
    icon: Building2,
  },
];

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Ingresa tu nombre."),
    lastName: z.string().min(2, "Ingresa tu apellido."),
    email: z.string().email("Ingresa un email valido."),
    dni: z.string().regex(/^[0-9.\s-]{7,14}$/, "Ingresa un DNI valido."),
    birthDate: z.string().min(1, "Ingresa tu fecha de nacimiento."),
    phone: z.string().min(6, "Ingresa un telefono valido."),
    country: z.string().min(2, "Ingresa tu pais."),
    province: z.string().min(2, "Ingresa tu provincia."),
    address: z.string().min(4, "Ingresa tu direccion."),
    password: z.string()
      .min(6, passwordRuleMessage)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/, passwordRuleMessage),
    confirmPassword: z.string().min(6, "Confirma la contrasena."),
    termsAccepted: z.literal(true, {
      error: "Debes aceptar los terminos y condiciones.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden.",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    const value = new Date(`${data.birthDate}T00:00:00`);
    const limit = new Date();
    limit.setFullYear(limit.getFullYear() - 18);
    return value <= limit;
  }, {
    message: "Debes ser mayor de 18 anos para registrarte.",
    path: ["birthDate"],
  });

const initialForm: AuthRegisterRequest = {
  firstName: "",
  lastName: "",
  email: "",
  dni: "",
  birthDate: "",
  phone: "",
  country: "Argentina",
  province: "",
  address: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
};

export function RegisterForm() {
  const router = useRouter();
  const { login } = useSession();
  const [selectedRole, setSelectedRole] = useState<Role>("INVESTOR");
  const [form, setForm] = useState<AuthRegisterRequest>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AuthRegisterRequest, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<SensitiveField, boolean>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordStrength = getPasswordStrength(form.password);

  function validateSensitiveField(field: SensitiveField, values: AuthRegisterRequest) {
    if (field === "dni") {
      return dniRuleRegex.test(values.dni) ? undefined : dniRuleMessage;
    }

    if (field === "password") {
      return passwordRuleRegex.test(values.password) ? undefined : passwordRuleMessage;
    }

    if (!values.confirmPassword) {
      return "Confirma la contrasena.";
    }

    if (!values.password) {
      return undefined;
    }

    return values.password === values.confirmPassword ? undefined : "Las contrasenas no coinciden.";
  }

  function updateField<K extends keyof AuthRegisterRequest>(key: K, value: AuthRegisterRequest[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === "dni" && touched.dni) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          dni: validateSensitiveField("dni", next),
        }));
      }

      if (key === "password") {
        setErrors((currentErrors) => ({
          ...currentErrors,
          password: touched.password ? validateSensitiveField("password", next) : currentErrors.password,
          confirmPassword: touched.confirmPassword ? validateSensitiveField("confirmPassword", next) : currentErrors.confirmPassword,
        }));
      }

      if (key === "confirmPassword" && touched.confirmPassword) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          confirmPassword: validateSensitiveField("confirmPassword", next),
        }));
      }

      return next;
    });
  }

  function handleSensitiveBlur(field: SensitiveField) {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({
      ...current,
      [field]: validateSensitiveField(field, form),
    }));
  }

  const finishLogin = useCallback((token: string) => {
    login(token);
    const parsed = parseSessionToken(token);
    router.push(parsed.profileCompleted ? "/dashboard" : "/complete-profile?next=%2Fdashboard");
  }, [login, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setTouched({
        dni: true,
        password: true,
        confirmPassword: true,
      });
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        email: fieldErrors.email?.[0],
        dni: fieldErrors.dni?.[0],
        birthDate: fieldErrors.birthDate?.[0],
        phone: fieldErrors.phone?.[0],
        country: fieldErrors.country?.[0],
        province: fieldErrors.province?.[0],
        address: fieldErrors.address?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
        termsAccepted: fieldErrors.termsAccepted?.[0],
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const email = form.email;
      await apiClient.post("/api/auth/register/request", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        dni: form.dni,
        birthDate: form.birthDate,
        phone: form.phone,
        country: form.country,
        province: form.province,
        address: form.address,
        termsAccepted: form.termsAccepted,
        password: form.password,
        roleName: selectedRole,
      });
      setForm(initialForm);
      setTouched({});
      router.push(`/verify-email?email=${encodeURIComponent(email)}&from=register`);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo iniciar el registro.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const finishGoogleLogin = useCallback((token: string) => {
    finishLogin(token);
  }, [finishLogin]);

  const handleGoogleCredential = useCallback(async (idToken: string) => {
    setServerError(null);
    const response = await apiClient.post<AuthLoginResponse>("/api/auth/google", {
      idToken,
      roleName: selectedRole,
    });
    finishGoogleLogin(response.data.accessToken);
  }, [finishGoogleLogin, selectedRole]);

  return (
    <Card
      title="Crear cuenta"
      description="Completa tus datos para operar con un perfil verificado y listo para KYC."
      className="w-full max-w-2xl"
    >
      <form className="grid gap-7" onSubmit={handleSubmit}>
        <section className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-foreground-subtle)]">
            Tipo de cuenta
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {roles.map(({ value, label, description, icon: Icon }) => {
              const active = selectedRole === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedRole(value)}
                  className={`flex min-h-28 flex-col gap-2 rounded-lg border p-3 text-left transition-colors ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-muted)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-md ${active ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface-raised)]"}`}>
                      <Icon className={`h-4 w-4 ${active ? "text-white" : "text-[var(--color-foreground-subtle)]"}`} />
                    </div>
                    {active && <Check className="h-4 w-4 text-[var(--color-primary)]" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">{label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-foreground-subtle)]">{description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4">
          <p className="text-sm font-semibold text-[var(--color-foreground)]">Identidad</p>
          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
            <Input label="Nombre" value={form.firstName} error={errors.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
            <Input label="Apellido" value={form.lastName} error={errors.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
            <Input label="Email" type="email" placeholder="tu@email.com" value={form.email} error={errors.email} onChange={(event) => updateField("email", event.target.value)} />
            <Input
              label="DNI"
              inputMode="numeric"
              placeholder="Ej: 12.345.678"
              value={form.dni}
              error={errors.dni}
              onBlur={() => handleSensitiveBlur("dni")}
              onChange={(event) => updateField("dni", event.target.value)}
            />
            <Input label="Fecha de nacimiento" type="date" value={form.birthDate} error={errors.birthDate} onChange={(event) => updateField("birthDate", event.target.value)} />
            <Input label="Telefono" value={form.phone} error={errors.phone} onChange={(event) => updateField("phone", event.target.value)} />
          </div>
        </section>

        <section className="grid gap-4">
          <p className="text-sm font-semibold text-[var(--color-foreground)]">Contacto</p>
          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
            <Input label="Pais" value={form.country} error={errors.country} onChange={(event) => updateField("country", event.target.value)} />
            <Input label="Provincia" value={form.province} error={errors.province} onChange={(event) => updateField("province", event.target.value)} />
            <Input label="Direccion" className="sm:col-span-2" value={form.address} error={errors.address} onChange={(event) => updateField("address", event.target.value)} />
          </div>
        </section>

        <section className="grid gap-4">
          <p className="text-sm font-semibold text-[var(--color-foreground)]">Seguridad</p>
          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
            <Input
              label="Contrasena"
              type="password"
              placeholder="Ej: Solar123!"
              value={form.password}
              error={errors.password}
              onBlur={() => handleSensitiveBlur("password")}
              onChange={(event) => updateField("password", event.target.value)}
            />
            <Input
              label="Confirmar contrasena"
              type="password"
              placeholder="Repite la contrasena"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              onBlur={() => handleSensitiveBlur("confirmPassword")}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
            />
            <div className="grid gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 sm:col-span-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${passwordStrength.toneClassName} ${passwordStrength.widthClassName}`}
                />
              </div>
              <div className="grid gap-1 text-xs leading-5 text-[var(--color-foreground-subtle)]">
                <span>{passwordRuleHint}</span>
                <span className="text-[var(--color-foreground-muted)]">
                  Fortaleza: <span className="font-medium text-[var(--color-foreground)]">{passwordStrength.label}</span>
                </span>
              </div>
            </div>
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

        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[var(--color-foreground-subtle)]">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          o registrate con
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <GoogleAuthButton onCredential={handleGoogleCredential} disabled={isSubmitting} />

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

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando verificacion...
            </span>
          ) : (
            "Crear cuenta profesional"
          )}
        </Button>
      </form>
    </Card>
  );
}
