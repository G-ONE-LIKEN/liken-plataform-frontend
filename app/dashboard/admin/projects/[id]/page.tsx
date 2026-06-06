"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, Zap, TrendingUp, Coins, Calendar, Target, Wallet,
  Sun, Wind, Droplets, Leaf, User, FileText, Building2, Hash, Globe,
  CheckCircle2, XCircle, Loader2, AlertTriangle, Info, Activity, Archive,
} from "lucide-react";
import { AccessGate } from "@/features/auth/components/access-gate";
import { useProjectDetail } from "@/features/projects/hooks/use-projects";
import { useApproveProject, useRejectProject } from "@/features/projects/hooks/use-project-mutations";
import { Badge } from "@/shared/ui/badge";
import { EmptyState } from "@/shared/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { formatCurrency, formatDate, formatPercent } from "@/shared/lib/utils";

const ENERGY_ICONS = { SOLAR: Sun, WIND: Wind, HYDRO: Droplets, BIOMASS: Leaf };
const ENERGY_LABELS = {
  SOLAR: "Solar fotovoltaico",
  WIND: "Eólica",
  HYDRO: "Hidroeléctrica",
  BIOMASS: "Biomasa",
};

function StateBadge({ state }: { state: string }) {
  if (state === "PENDING_APPROVAL") return <Badge tone="warning">Pendiente de aprobación</Badge>;
  if (state === "DRAFT") return <Badge tone="neutral">Borrador (aprobado)</Badge>;
  if (state === "CANCELLED") return <Badge tone="danger">Rechazado / Cancelado</Badge>;
  if (state === "PRE_OPEN") return <Badge tone="warning">En construcción</Badge>;
  if (state === "OPEN") return <Badge tone="success">Abierto a inversión</Badge>;
  if (state === "CLOSED") return <Badge tone="neutral">Cerrado</Badge>;
  return <Badge tone="neutral">{state}</Badge>;
}

function ReviewContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = Number(params.id);
  const { data, isLoading, isError, error } = useProjectDetail(projectId);

  const approve = useApproveProject();
  const reject = useRejectProject();
  const [reason, setReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [pending, setPending] = useState<"APPROVE" | "REJECT" | null>(null);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <EmptyState
          title="No pudimos cargar el detalle"
          description={error instanceof Error ? error.message : "Revisá disponibilidad del servicio de proyectos."}
        />
      </main>
    );
  }

  const EnergyIcon = ENERGY_ICONS[data.energyType] ?? Zap;
  const isPending = data.state === "PENDING_APPROVAL";
  const isActive = data.state === "DRAFT" || data.state === "PRE_OPEN" || data.state === "OPEN";
  const isFinished = data.state === "CLOSED" || data.state === "CANCELLED";

  // Métricas de captación (solo aplica si el proyecto ya está en algún estado post-pending)
  const raised  = data.raisedAmount ? Number(data.raisedAmount)  : 0;
  const hardCap = data.hardCap      ? Number(data.hardCap)       : 0;
  const softCap = data.softCap      ? Number(data.softCap)       : 0;
  // En la etapa OPEN se muestra earlyBird; en CLOSED el standard. `currentPrice`
  // viene resuelto por el backend (espejo de ProjectRegistry.currentPrice).
  const tokenPrice = data.currentPrice ? Number(data.currentPrice)  : 0;
  const totalTokens = data.totalTokens ? Number(data.totalTokens) : 0;
  const hardCapPct = hardCap > 0 ? Math.min(100, (raised / hardCap) * 100) : 0;
  const softCapPct = softCap > 0 ? Math.min(100, (raised / softCap) * 100) : 0;
  const estimatedTokensSold = tokenPrice > 0 ? raised / tokenPrice : 0;
  const realTokensSold = data.totalTokensSold != null ? Number(data.totalTokensSold) : NaN;
  const hasRealTokensSold = Number.isFinite(realTokensSold);
  const tokensSold = hasRealTokensSold ? realTokensSold : estimatedTokensSold;
  const tokensSoldPct = totalTokens > 0 ? Math.min(100, (tokensSold / totalTokens) * 100) : 0;
  const softCapReached = softCap > 0 && raised >= softCap;
  const hardCapReached = hardCap > 0 && raised >= hardCap;

  const eyebrowText = isPending
    ? `Revisión de propuesta · ${ENERGY_LABELS[data.energyType]}`
    : isActive
    ? `Proyecto activo · ${ENERGY_LABELS[data.energyType]}`
    : `Proyecto finalizado · ${ENERGY_LABELS[data.energyType]}`;

  async function handleApprove() {
    setPending("APPROVE");
    try {
      await approve.mutateAsync(projectId);
      toast({ title: "Proyecto aprobado", description: data!.name });
      router.push("/dashboard/admin/projects");
    } catch (err) {
      toast({
        title: "Error al aprobar",
        description: err instanceof Error ? err.message : "Error inesperado.",
        variant: "destructive",
      });
    } finally {
      setPending(null);
    }
  }

  async function handleReject() {
    setPending("REJECT");
    try {
      await reject.mutateAsync({ id: projectId, reason: reason.trim() || undefined });
      toast({ title: "Proyecto rechazado", description: data!.name });
      router.push("/dashboard/admin/projects");
    } catch (err) {
      toast({
        title: "Error al rechazar",
        description: err instanceof Error ? err.message : "Error inesperado.",
        variant: "destructive",
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a proyectos
        </Link>
        <StateBadge state={data.state} />
      </div>

      {/* Header de revisión */}
      <header className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <EnergyIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              {eyebrowText}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {data.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Hash className="h-3 w-3" /> ID #{data.id}</span>
              <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> Owner #{data.ownerId}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Enviado {formatDate(data.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Banner contextual según estado */}
        {isPending && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
            <div>
              <p className="font-medium text-foreground">Pendiente de tu revisión</p>
              <p className="text-xs text-muted-foreground">
                Validá la información antes de aprobar. Una vez aprobado, el proyecto pasa a Borrador y el dueño podrá avanzar al estado de captación.
              </p>
            </div>
          </div>
        )}
        {isActive && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
            <Activity className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            <div>
              <p className="font-medium text-foreground">Vista de monitoreo</p>
              <p className="text-xs text-muted-foreground">
                Estás viendo el detalle como administrador. Podés monitorear la captación y las métricas, pero no operar como inversor.
              </p>
            </div>
          </div>
        )}
        {isFinished && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3 text-sm">
            <Archive className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Proyecto {data.state === "CANCELLED" ? "cancelado" : "cerrado"}</p>
              <p className="text-xs text-muted-foreground">
                {data.state === "CANCELLED"
                  ? "El proyecto fue cancelado o rechazado. No hay operaciones activas."
                  : "El ciclo de captación finalizó. Vista de solo lectura."}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Métricas de captación — solo para proyectos activos o cerrados */}
      {(isActive || isFinished) && (hardCap > 0 || softCap > 0 || raised > 0) && (
        <Section title="Captación" icon={Target}>
          <div className="space-y-6">
            {hardCap > 0 && (
              <div>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm text-muted-foreground">Recaudado</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(String(raised))}
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      de {formatCurrency(String(hardCap))}
                    </span>
                  </p>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${hardCapPct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {hardCapPct.toFixed(2)}% del hard cap{hardCapReached && " · ✓ Hard cap alcanzado"}
                </p>
              </div>
            )}

            {softCap > 0 && !hardCapReached && (
              <div className="rounded-lg bg-secondary/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Soft cap (mínimo viable)</span>
                  <span className={`text-sm font-semibold ${softCapReached ? "text-green-500" : "text-foreground"}`}>
                    {softCapReached ? "✓ Alcanzado" : `${softCapPct.toFixed(1)}%`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatCurrency(String(softCap))}
                  {data.expectedOpenDate && ` · vencimiento ${formatDate(data.expectedOpenDate)}`}
                </p>
              </div>
            )}

            <Grid>
              <Field label="Tokens emitidos" value={data.totalTokens || "—"} highlight />
              <Field
                label={hasRealTokensSold ? "Tokens vendidos" : "Tokens vendidos (est.)"}
                value={tokensSold > 0 ? `${tokensSold.toFixed(2)} (${tokensSoldPct.toFixed(1)}%)` : "—"}
              />
              <Field
                label="Precio vigente"
                value={
                  data.currentPrice ? (
                    <>
                      {formatCurrency(data.currentPrice)}
                      {data.state === "OPEN" && (
                        <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-primary">
                          early bird
                        </span>
                      )}
                      {data.state === "CLOSED" && (
                        <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          standard
                        </span>
                      )}
                    </>
                  ) : (
                    "—"
                  )
                }
              />
              <Field label="APY estimado" value={data.expectedAnnualYield ? formatPercent(data.expectedAnnualYield) : "—"} highlight />
              <Field label="Inversión mínima" value={data.minimumInvestment ? formatCurrency(data.minimumInvestment) : "—"} />
              <Field label="Producción anual" value={data.expectedAnnualProductionMWh ? `${data.expectedAnnualProductionMWh} MWh` : "—"} />
            </Grid>
          </div>
        </Section>
      )}

      {/* Descripción */}
      <Section title="Descripción de la propuesta" icon={FileText}>
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
          {data.description || <span className="text-muted-foreground italic">Sin descripción.</span>}
        </p>
      </Section>

      {/* Datos del proponente */}
      <Section title="Proponente" icon={Building2}>
        <Grid>
          <Field label="Developer ID" value={`#${data.ownerId}`} />
          <Field label="Enviado" value={formatDate(data.createdAt)} />
          <Field label="Última actualización" value={formatDate(data.updatedAt)} />
        </Grid>
      </Section>

      {/* Ubicación */}
      <Section title="Ubicación" icon={MapPin}>
        <Grid>
          <Field label="País" value={data.country || "—"} />
          <Field label="Provincia / Región" value={data.province || "—"} />
          <Field
            label="Coordenadas"
            value={
              data.latitude && data.longitude
                ? `${data.latitude}, ${data.longitude}`
                : "—"
            }
          />
          {data.latitude && data.longitude && (
            <a
              href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 self-end text-xs font-medium text-primary hover:underline"
            >
              <Globe className="h-3 w-3" /> Ver en Google Maps
            </a>
          )}
        </Grid>
      </Section>

      {/* Especificaciones técnicas */}
      <Section title="Especificaciones técnicas" icon={Zap}>
        <Grid>
          <Field
            label="Potencia instalada"
            value={data.installedCapacityMW ? `${data.installedCapacityMW} MW` : "—"}
          />
          <Field
            label="Producción anual estimada"
            value={data.expectedAnnualProductionMWh ? `${data.expectedAnnualProductionMWh} MWh` : "—"}
          />
          <Field label="Tipo de energía" value={ENERGY_LABELS[data.energyType]} />
        </Grid>
      </Section>

      {/* Estructura financiera */}
      <Section title="Estructura financiera" icon={Coins}>
        <Grid>
          <Field label="Total de tokens" value={data.totalTokens || "—"} highlight />
          <Field label="Early bird (FUNDING)" value={data.earlyBirdPrice ? formatCurrency(data.earlyBirdPrice) : "—"} highlight />
          <Field label="Standard (ACTIVE)" value={data.standardPrice ? formatCurrency(data.standardPrice) : "—"} highlight />
          <Field
            label="Inversión mínima"
            value={data.minimumInvestment ? formatCurrency(data.minimumInvestment) : "—"}
          />
          <Field
            label="Rendimiento anual esperado"
            value={data.expectedAnnualYield ? formatPercent(data.expectedAnnualYield) : "—"}
            highlight
          />
          <Field
            label="Soft cap"
            value={data.softCap ? formatCurrency(data.softCap) : "—"}
          />
          <Field
            label="Hard cap"
            value={data.hardCap ? formatCurrency(data.hardCap) : "—"}
          />
        </Grid>
      </Section>

      {/* Cronograma — Fase 6: única fecha clave. expectedOpenDate cumple
          doble función: apertura del parque Y deadline del soft cap. */}
      <Section title="Cronograma" icon={Calendar}>
        <Grid>
          <Field
            label="Apertura esperada del parque"
            value={data.expectedOpenDate ? formatDate(data.expectedOpenDate) : "—"}
            highlight
          />
          <Field
            label="Deadline del soft cap"
            value={data.expectedOpenDate ? formatDate(data.expectedOpenDate) : "—"}
          />
        </Grid>
      </Section>

      {/* Histórico de aprobación si aplica */}
      {(data.approvedAt || data.rejectionReason) && (
        <Section title="Historial de revisión" icon={Target}>
          <Grid>
            {data.approvedBy != null && <Field label="Revisado por" value={`Admin #${data.approvedBy}`} />}
            {data.approvedAt && <Field label="Fecha de revisión" value={formatDate(data.approvedAt)} />}
            {data.rejectionReason && (
              <div className="md:col-span-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-destructive">Motivo de rechazo</p>
                <p className="mt-1 text-sm text-foreground">{data.rejectionReason}</p>
              </div>
            )}
          </Grid>
        </Section>
      )}

      {/* Acciones de revisión */}
      {isPending && (
        <div className="sticky bottom-4 z-10 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur">
          {showRejectBox ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Motivo del rechazo</p>
                <button
                  type="button"
                  onClick={() => setShowRejectBox(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancelar
                </button>
              </div>
              <Textarea
                placeholder="Explicá brevemente por qué rechazás esta propuesta. El developer verá este mensaje."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button
                  className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
                  disabled={!!pending}
                  onClick={handleReject}
                >
                  {pending === "REJECT" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Confirmar rechazo
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                ¿Esta propuesta cumple con los criterios de la plataforma?
              </p>
              <div className="flex gap-2">
                <Button
                  className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
                  disabled={!!pending}
                  onClick={() => setShowRejectBox(true)}
                >
                  <XCircle className="h-4 w-4" />
                  Rechazar
                </Button>
                <Button
                  className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
                  disabled={!!pending}
                  onClick={handleApprove}
                >
                  {pending === "APPROVE" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Aprobar proyecto
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">{children}</div>;
}

function Field({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-sm ${
          highlight ? "font-semibold text-foreground" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function AdminProjectReviewPage() {
  return (
    <AccessGate allow={(ctx) => ctx.isAdmin}>
      <ReviewContent />
    </AccessGate>
  );
}
