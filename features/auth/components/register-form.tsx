"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  IdCard,
  Loader2,
  Lock,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Zap,
} from "lucide-react";
import { z } from "zod";
import { apiClient, ApiClientError } from "@/shared/lib/api-client";
import { Button } from "@/shared/ui/button";
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

const roles: { value: Role; label: string; description: string; tagline: string; icon: typeof TrendingUp }[] = [
  {
    value: "INVESTOR",
    label: "Inversor",
    tagline: "Quiero hacer crecer mi capital",
    description: "Invertir en proyectos de energia renovable y recibir dividendos en tokens LKN.",
    icon: TrendingUp,
  },
  {
    value: "DEVELOPER",
    label: "Desarrollador",
    tagline: "Quiero financiar mi proyecto",
    description: "Publicar proyectos energeticos y captar capital con aprobacion de LIKEN.",
    icon: Building2,
  },
];

// Reglas base reutilizables por la validacion por pasos y la validacion final.
const fieldRules = {
  firstName: z.string().min(2, "Ingresa tu nombre."),
  lastName: z.string().min(2, "Ingresa tu apellido."),
  email: z.string().email("Ingresa un email valido."),
  dni: z.string().regex(dniRuleRegex, dniRuleMessage),
  birthDate: z.string().min(1, "Ingresa tu fecha de nacimiento."),
  phone: z.string().min(6, "Ingresa un telefono valido."),
  country: z.string().min(2, "Ingresa tu pais."),
  province: z.string().min(2, "Ingresa tu provincia."),
  address: z.string().min(4, "Ingresa tu direccion."),
  password: z
    .string()
    .min(6, passwordRuleMessage)
    .regex(passwordRuleRegex, passwordRuleMessage),
  confirmPassword: z.string().min(6, "Confirma la contrasena."),
  termsAccepted: z.literal(true, {
    error: "Debes aceptar los terminos y condiciones.",
  }),
};

const isAdult = (birthDate: string) => {
  const value = new Date(`${birthDate}T00:00:00`);
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() - 18);
  return value <= limit;
};
const adultRefinement = { message: "Debes ser mayor de 18 anos para registrarte.", path: ["birthDate"] };
const matchRefinement = { message: "Las contrasenas no coinciden.", path: ["confirmPassword"] };

const baseRegisterSchema = z.object(fieldRules);

const personalSchema = baseRegisterSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    dni: true,
    birthDate: true,
    phone: true,
    country: true,
    province: true,
    address: true,
  })
  .refine((data) => isAdult(data.birthDate), adultRefinement);

const securitySchema = baseRegisterSchema
  .pick({ password: true, confirmPassword: true, termsAccepted: true })
  .refine((data) => data.password === data.confirmPassword, matchRefinement);

const registerSchema = baseRegisterSchema
  .refine((data) => data.password === data.confirmPassword, matchRefinement)
  .refine((data) => isAdult(data.birthDate), adultRefinement);

const personalFields = [
  "firstName",
  "lastName",
  "email",
  "dni",
  "birthDate",
  "phone",
  "country",
  "province",
  "address",
] as const;

// Mapea un error del backend (email/dni ya registrado, etc.) al campo y paso que lo origina,
// para resaltarlo y volver automaticamente a ese paso sin que el usuario tenga que retroceder a mano.
function mapServerErrorToField(
  error: unknown,
): { field: keyof AuthRegisterRequest; step: number; message: string } | null {
  if (!(error instanceof Error)) return null;
  const code = error instanceof ApiClientError ? (error.code ?? "").toUpperCase() : "";
  const haystack = `${code} ${error.message}`.toLowerCase();

  if (/email|correo|e-mail/.test(haystack)) {
    return { field: "email", step: 1, message: error.message };
  }
  if (/dni|documento/.test(haystack)) {
    return { field: "dni", step: 1, message: error.message };
  }
  if (/telefono|phone/.test(haystack)) {
    return { field: "phone", step: 1, message: error.message };
  }
  return null;
}

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

const steps = [
  { id: "type", label: "Perfil", title: "Elegi tu tipo de cuenta", icon: UserRound },
  { id: "personal", label: "Datos", title: "Contanos quien sos", icon: IdCard },
  { id: "security", label: "Seguridad", title: "Asegura tu cuenta", icon: Lock },
] as const;

type FieldErrors = Partial<Record<keyof AuthRegisterRequest, string>>;

export function RegisterForm() {
  const router = useRouter();
  const { login } = useSession();
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role>("INVESTOR");
  const [form, setForm] = useState<AuthRegisterRequest>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<SensitiveField, boolean>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const passwordStrength = getPasswordStrength(form.password);

  const progress = useMemo(() => (step / (steps.length - 1)) * 100, [step]);

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
    setServerError(null);
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

      if (errors[key] && key !== "password" && key !== "confirmPassword") {
        setErrors((currentErrors) => ({ ...currentErrors, [key]: undefined }));
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

  function collectErrors(error: z.ZodError): FieldErrors {
    const flat = error.flatten().fieldErrors as Record<string, string[] | undefined>;
    const next: FieldErrors = {};
    for (const key of Object.keys(flat)) {
      next[key as keyof AuthRegisterRequest] = flat[key]?.[0];
    }
    return next;
  }

  function goToStep(target: number) {
    setServerError(null);
    const next = Math.max(0, Math.min(steps.length - 1, target));
    // Al avanzar a un paso nuevo no arrastramos errores ni "touched": los campos solo se
    // validan tras interactuar con ellos o al pulsar "Continuar" / "Crear cuenta".
    if (next > step) {
      setErrors({});
      setTouched({});
    }
    setStep(next);
  }

  function handleContinue() {
    if (step === 1) {
      const parsed = personalSchema.safeParse(form);
      if (!parsed.success) {
        setTouched((current) => ({ ...current, dni: true }));
        setErrors((current) => ({ ...current, ...collectErrors(parsed.error) }));
        return;
      }
    }
    goToStep(step + 1);
  }

  // Enter nunca envia el formulario: solo avanza de paso. Asi evitamos envios accidentales
  // (p. ej. mantener Enter presionado) que dejaban todos los campos del ultimo paso en rojo.
  // El envio final requiere clic explicito en "Crear cuenta".
  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") return;
    const target = event.target as HTMLElement;
    if (target.tagName === "TEXTAREA") return;
    event.preventDefault();
    if (step < steps.length - 1) {
      handleContinue();
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const securityParsed = securitySchema.safeParse(form);
    if (!securityParsed.success) {
      setTouched({ dni: true, password: true, confirmPassword: true });
      setErrors((current) => ({ ...current, ...collectErrors(securityParsed.error) }));
      return;
    }

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      // Algun dato de un paso anterior quedo invalido: lo mostramos y volvemos a ese paso.
      const fieldErrors = collectErrors(parsed.error);
      setTouched({ dni: true, password: true, confirmPassword: true });
      setErrors(fieldErrors);
      const brokenPersonal = personalFields.some((field) => fieldErrors[field]);
      if (brokenPersonal) goToStep(1);
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
      const mapped = mapServerErrorToField(error);
      if (mapped) {
        // Resaltamos el campo conflictivo y volvemos automaticamente a su paso.
        if (mapped.field === "dni") setTouched((current) => ({ ...current, dni: true }));
        setErrors((current) => ({ ...current, [mapped.field]: mapped.message }));
        goToStep(mapped.step);
        setServerError(null);
      } else {
        setServerError(error instanceof Error ? error.message : "No se pudo iniciar el registro.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleCredential = useCallback(async (idToken: string) => {
    setServerError(null);
    const response = await apiClient.post<AuthLoginResponse>("/api/auth/google", {
      idToken,
      roleName: selectedRole,
    });
    finishLogin(response.data.accessToken);
  }, [finishLogin, selectedRole]);

  const activeStep = steps[step];

  return (
    <div className="relative w-full max-w-2xl">
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
        {/* Linea superior degradada — acento de marca */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />

        <div className="p-6 sm:p-8">
          {/* Header con marca + medidor de carga */}
          <header className="mb-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] shadow-[0_0_24px_-4px_oklch(0.72_0.16_165/0.7)]">
                  <Zap className="h-5 w-5 text-[var(--color-primary-foreground)]" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold tracking-tight text-[var(--color-foreground)]">Crear cuenta</p>
                  <p className="text-[11px] text-[var(--color-foreground-subtle)]">Perfil verificado · listo para KYC</p>
                </div>
              </div>
              <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-medium tabular-nums text-[var(--color-foreground-muted)]">
                Paso {step + 1} / {steps.length}
              </span>
            </div>

            {/* Barra de carga energetica */}
            <div className="relative h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-[width] duration-500 ease-out"
                style={{ width: `${Math.max(progress, 6)}%` }}
              />
            </div>

            {/* Estados de cada paso */}
            <ol className="mt-4 grid grid-cols-3 gap-2">
              {steps.map((s, index) => {
                const state = index < step ? "done" : index === step ? "current" : "upcoming";
                const StepIcon = s.icon;
                const clickable = index < step;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      disabled={!clickable}
                      onClick={() => clickable && goToStep(index)}
                      className={`flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left transition ${
                        clickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                          state === "done"
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                            : state === "current"
                              ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]"
                              : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground-subtle)]"
                        }`}
                      >
                        {state === "done" ? <Check className="h-3.5 w-3.5" /> : <StepIcon className="h-3.5 w-3.5" />}
                      </span>
                      <span
                        className={`hidden text-xs font-medium sm:block ${
                          state === "upcoming" ? "text-[var(--color-foreground-subtle)]" : "text-[var(--color-foreground)]"
                        }`}
                      >
                        {s.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </header>

          <h2 className="mb-1 text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {activeStep.title}
          </h2>
          <p className="mb-6 text-sm text-[var(--color-foreground-muted)]">
            {step === 0 && "Asi adaptamos la plataforma a tu objetivo dentro de LIKEN."}
            {step === 1 && "Necesitamos estos datos para verificar tu identidad."}
            {step === 2 && "Un ultimo paso y te enviamos el codigo de verificacion."}
          </p>

          <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="grid gap-7">
            {/* Contenedor animado por paso */}
            <div key={step} className="grid gap-7 animate-in fade-in slide-in-from-right-3 duration-300">
              {step === 0 && (
                <section className="grid gap-3 sm:grid-cols-2">
                  {roles.map(({ value, label, description, tagline, icon: Icon }) => {
                    const active = selectedRole === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedRole(value)}
                        aria-pressed={active}
                        className={`group relative flex min-h-44 flex-col gap-3 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 ${
                          active
                            ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-[0_0_0_1px_var(--color-primary),0_18px_40px_-24px_oklch(0.72_0.16_165/0.8)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-strong)] hover:bg-[var(--color-panel)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                              active ? "bg-[var(--color-primary)]" : "bg-[var(--color-panel)] group-hover:bg-[var(--color-surface-strong)]"
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${active ? "text-[var(--color-primary-foreground)]" : "text-[var(--color-foreground-muted)]"}`} />
                          </div>
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                              active
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                                : "border-[var(--color-border)] text-transparent"
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[var(--color-foreground)]">{label}</p>
                          <p className="mt-0.5 text-xs font-medium text-[var(--color-primary-strong)]">{tagline}</p>
                          <p className="mt-2 text-xs leading-relaxed text-[var(--color-foreground-muted)]">{description}</p>
                        </div>
                      </button>
                    );
                  })}
                </section>
              )}

              {step === 1 && (
                <div className="grid gap-7">
                  <section className="grid gap-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
                      <UserRound className="h-4 w-4 text-[var(--color-primary)]" />
                      Identidad
                    </p>
                    <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                      <Input label="Nombre" value={form.firstName} error={errors.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
                      <Input label="Apellido" value={form.lastName} error={errors.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
                      <Input label="Email" type="email" placeholder="tu@email.com" value={form.email} error={errors.email} onChange={(e) => updateField("email", e.target.value)} />
                      <Input
                        label="DNI"
                        inputMode="numeric"
                        placeholder="Ej: 12.345.678"
                        value={form.dni}
                        error={errors.dni}
                        onBlur={() => handleSensitiveBlur("dni")}
                        onChange={(e) => updateField("dni", e.target.value)}
                      />
                      <Input label="Fecha de nacimiento" type="date" value={form.birthDate} error={errors.birthDate} onChange={(e) => updateField("birthDate", e.target.value)} />
                      <Input label="Telefono" value={form.phone} error={errors.phone} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                  </section>

                  <section className="grid gap-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
                      <Building2 className="h-4 w-4 text-[var(--color-primary)]" />
                      Contacto
                    </p>
                    <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                      <Input label="Pais" value={form.country} error={errors.country} onChange={(e) => updateField("country", e.target.value)} />
                      <Input label="Provincia" value={form.province} error={errors.province} onChange={(e) => updateField("province", e.target.value)} />
                      <Input label="Direccion" className="sm:col-span-2" value={form.address} error={errors.address} onChange={(e) => updateField("address", e.target.value)} />
                    </div>
                  </section>

                  <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[var(--color-foreground-subtle)]">
                    <span className="h-px flex-1 bg-[var(--color-border)]" />
                    o registrate al instante con
                    <span className="h-px flex-1 bg-[var(--color-border)]" />
                  </div>
                  <GoogleAuthButton onCredential={handleGoogleCredential} disabled={isSubmitting} />
                  <p className="text-center text-xs text-[var(--color-foreground-subtle)]">
                    Crearas tu cuenta como{" "}
                    <span className="font-semibold text-[var(--color-foreground)]">
                      {roles.find((r) => r.value === selectedRole)?.label}
                    </span>{" "}
                    con Google.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-7">
                  <section className="grid gap-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
                      <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />
                      Seguridad
                    </p>
                    <div className="grid gap-5">
                      <Input
                        label="Contrasena"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.password}
                        error={touched.password ? errors.password : undefined}
                        onBlur={() => handleSensitiveBlur("password")}
                        onChange={(e) => updateField("password", e.target.value)}
                        endAdornment={
                          <RevealToggle
                            shown={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                            label="contrasena"
                          />
                        }
                      />
                      <Input
                        label="Confirmar contrasena"
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repite la contrasena"
                        value={form.confirmPassword}
                        error={touched.confirmPassword ? errors.confirmPassword : undefined}
                        onBlur={() => handleSensitiveBlur("confirmPassword")}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        endAdornment={
                          <RevealToggle
                            shown={showConfirm}
                            onToggle={() => setShowConfirm((v) => !v)}
                            label="confirmacion de contrasena"
                          />
                        }
                      />
                      <div className="grid gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[var(--color-foreground)]">Fortaleza de la contrasena</span>
                          <span className="font-semibold text-[var(--color-foreground)]">{passwordStrength.label}</span>
                        </div>
                        <div className="flex gap-1.5">
                          {[0, 1, 2, 3].map((segment) => (
                            <div
                              key={segment}
                              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                                segment < passwordStrength.score ? passwordStrength.toneClassName : "bg-[var(--color-surface-strong)]"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs leading-5 text-[var(--color-foreground-subtle)]">{passwordRuleHint}</span>
                      </div>
                    </div>
                  </section>

                  <label className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 text-sm text-[var(--color-foreground-muted)] transition-colors has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary-soft)]">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
                      checked={form.termsAccepted}
                      onChange={(e) => updateField("termsAccepted", e.target.checked)}
                    />
                    <span>Acepto los terminos, condiciones y el tratamiento de datos necesario para operar en LIKEN.</span>
                  </label>
                  {errors.termsAccepted && <p className="-mt-4 text-xs text-[var(--color-danger)]">{errors.termsAccepted}</p>}
                </div>
              )}
            </div>

            {serverError && (
              <div className="rounded-xl border border-[rgba(214,69,93,0.3)] bg-[rgba(214,69,93,0.08)] px-4 py-3 text-sm text-[var(--color-danger)]">
                {serverError}
              </div>
            )}

            {/* Navegacion */}
            <div className="flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
              {step > 0 ? (
                <Button type="button" variant="secondary" className="h-11 gap-2 px-4" onClick={() => goToStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4" />
                  Atras
                </Button>
              ) : (
                <span className="text-xs text-[var(--color-foreground-subtle)]">
                  Perfil:{" "}
                  <span className="font-semibold text-[var(--color-foreground)]">
                    {roles.find((r) => r.value === selectedRole)?.label}
                  </span>
                </span>
              )}

              <div className="ml-auto">
                {step < steps.length - 1 ? (
                  <Button type="button" className="h-11 gap-2 px-6" onClick={handleContinue}>
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="h-11 gap-2 px-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando verificacion...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        Crear cuenta
                        <Zap className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function RevealToggle({
  shown,
  onToggle,
  label,
}: {
  shown: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      aria-label={shown ? `Ocultar ${label}` : `Mostrar ${label}`}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-foreground-subtle)] transition-colors hover:text-[var(--color-foreground)] focus:outline-none focus-visible:text-[var(--color-foreground)]"
    >
      {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}
