"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, MapPin, Zap, TrendingUp, Coins, Calendar, Target, Wallet,
  CheckCircle2, Sun, Wind, Droplets, Leaf, Info,
} from "lucide-react";
import { useProjectDetail } from "@/features/projects/hooks/use-projects";
import { ChangeStateMenu } from "@/features/projects/components/change-state-menu";
import { BuyLknFlow } from "@/features/invest/components/buy-lkn-flow";
import { RefundCard } from "@/features/invest/components/refund-card";
import { Badge } from "@/shared/ui/badge";
import { EmptyState } from "@/shared/ui/empty-state";
import { formatCurrency, formatDate } from "@/shared/lib/utils";
import { useSession } from "@/providers/session-provider";
import { getPermissionContext } from "@/features/auth/lib/session";

const GRADIENT_TEXT = "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent";

const ENERGY_ICONS = { SOLAR: Sun, WIND: Wind, HYDRO: Droplets, BIOMASS: Leaf };
const ENERGY_LABELS = {
  SOLAR: "Solar fotovoltaico",
  WIND: "Eolica",
  HYDRO: "Hidroelectrica",
  BIOMASS: "Biomasa",
};

const STATE_CONFIG: Record<string, { label: string; tone: "success" | "warning" | "neutral" | "danger" }> = {
  PENDING_APPROVAL: { label: "Pendiente de aprobacion", tone: "warning" },
  DRAFT: { label: "Borrador", tone: "neutral" },
  PRE_OPEN: { label: "En construccion", tone: "warning" },
  OPEN: { label: "Abierto a inversion", tone: "success" },
  CLOSED: { label: "Cerrado", tone: "neutral" },
  CANCELLED: { label: "Cancelado", tone: "danger" },
};

function toNum(v: string | undefined | null): number {
  if (v === undefined || v === null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);
  const { data, isLoading, isError, error } = useProjectDetail(projectId);
  const { user } = useSession();
  const perms = getPermissionContext(user);

  const calcs = useMemo(() => {
    if (!data) return null;
    const softCap = toNum(data.softCap);
    const hardCap = toNum(data.hardCap);
    const raised = toNum(data.raisedAmount);
    return {
      softCap,
      hardCap,
      raised,
      hardCapPct: hardCap > 0 ? Math.min(100, (raised / hardCap) * 100) : 0,
    };
  }, [data]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="h-64 animate-pulse rounded-2xl bg-card" />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <EmptyState
          title="No pudimos cargar el detalle"
          description={error instanceof Error ? error.message : "Revisa disponibilidad del servicio de proyectos."}
        />
      </main>
    );
  }

  const EnergyIcon = ENERGY_ICONS[data.energyType] ?? Zap;
  const stateConfig = STATE_CONFIG[data.state] ?? STATE_CONFIG.DRAFT;
  const showRound = calcs && (calcs.softCap > 0 || calcs.hardCap > 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver al catalogo
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={stateConfig.tone}>{stateConfig.label}</Badge>
          {(perms.isAdmin || user?.id === data.ownerId) && (
            <ChangeStateMenu
              projectId={data.id}
              currentState={data.state}
              isAdmin={perms.isAdmin}
              isOwner={user?.id === data.ownerId}
              onChainStatus={data.onChainStatus}
              size="sm"
            />
          )}
        </div>
      </div>

      <header className="relative isolate overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 -z-10 h-52 w-52 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.16 165 / 0.35), transparent 70%)" }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_28px_-4px_oklch(0.72_0.16_165/0.75)] sm:h-16 sm:w-16">
            <EnergyIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              {ENERGY_LABELS[data.energyType]}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {data.name}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {data.province}, {data.country}
            </p>
          </div>
        </div>

        {data.description && (
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {data.description}
          </p>
        )}
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard icon={TrendingUp} label="Rendimiento anual"
          value={data.expectedAnnualYield ? `${data.expectedAnnualYield}%` : "-"} accent />
        <KpiCard icon={Wallet} label="Inversion minima"
          value={data.minimumInvestment ? formatCurrency(data.minimumInvestment) : "-"} />
        <KpiCard icon={Coins}
          label={data.state === "PRE_OPEN" ? "Precio early bird" : data.state === "OPEN" ? "Precio standard" : "Precio del token"}
          value={data.currentPrice ? formatCurrency(data.currentPrice) : "-"} />
        <KpiCard icon={Zap} label="Potencia"
          value={data.installedCapacityMW ? `${data.installedCapacityMW} MW` : "-"} />
      </section>

      {showRound && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Avance de la ronda</h2>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm text-muted-foreground">Recaudado</p>
                <p className="text-xl font-bold text-foreground sm:text-2xl">
                  {formatCurrency(String(calcs!.raised))}
                  {calcs!.hardCap > 0 && (
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      de {formatCurrency(String(calcs!.hardCap))}
                    </span>
                  )}
                </p>
              </div>

              {calcs!.hardCap > 0 && (
                <div className="space-y-1.5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${calcs!.hardCapPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {calcs!.hardCapPct.toFixed(1)}% del hard cap
                  </p>
                </div>
              )}
            </div>

            {calcs!.softCap > 0 && (
              <div className="rounded-lg bg-secondary/40 p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Soft cap (minimo viable)</span>
                  <span className="font-medium text-foreground">{formatCurrency(String(calcs!.softCap))}</span>
                </div>
                {data.expectedOpenDate && (
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Fecha limite (apertura)</span>
                    <span className="font-medium text-foreground">{formatDate(data.expectedOpenDate)}</span>
                  </div>
                )}
                {calcs!.raised < calcs!.softCap && (
                  <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Info className="mt-0.5 h-3 w-3 shrink-0" />
                    Si no se alcanza el soft cap en la fecha limite, los inversores reciben reembolso total.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-card">
        <div aria-hidden className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />
        <header className="border-b border-border bg-gradient-to-br from-primary/10 to-transparent px-6 py-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Comprar LKN</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Aproba USDC y firma la compra en MetaMask. Los tokens se entregan al
            confirmar la transaccion on-chain.
          </p>
        </header>

        <div className="p-6">
          <BuyLknFlow project={data} />
        </div>
      </section>

      <div className="mt-4">
        <RefundCard project={data} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Cronograma</h2>
          </div>
          <div className="space-y-3">
            <TimelineRow
              label="Pre-compra (early bird)"
              date={null}
              hint={data.state === "PRE_OPEN" ? "En curso" : data.state === "DRAFT" ? "Proximamente" : "Cumplido"}
              active={["PRE_OPEN", "OPEN", "CLOSED"].includes(data.state)}
            />
            <TimelineRow
              label="Apertura del parque (deadline soft cap)"
              date={data.expectedOpenDate}
              active={["OPEN", "CLOSED"].includes(data.state)}
            />
            <TimelineRow
              label="Parque operativo (precio standard, dividendos)"
              date={null}
              hint={data.state === "OPEN" ? "Activo" : data.state === "CLOSED" ? "Cumplido" : "Pendiente"}
              active={["OPEN", "CLOSED"].includes(data.state)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold text-foreground">Detalles tecnicos</h2>
          <dl className="space-y-3 text-sm">
            <DetailRow label="Tipo de energia" value={ENERGY_LABELS[data.energyType]} />
            <DetailRow label="Potencia instalada"
              value={data.installedCapacityMW ? `${data.installedCapacityMW} MW` : "-"} />
            <DetailRow label="Soft cap"
              value={data.softCap ? formatCurrency(data.softCap) : "-"} />
            <DetailRow label="Hard cap"
              value={data.hardCap ? formatCurrency(data.hardCap) : "-"} />
            {data.expectedAnnualProductionMWh && (
              <DetailRow label="Produccion anual estimada"
                value={`${data.expectedAnnualProductionMWh} MWh`} />
            )}
            <DetailRow label="Tokens totales emitidos" value={data.totalTokens ?? "-"} />
            <DetailRow label="Ubicacion" value={`${data.province}, ${data.country}`} />
          </dl>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground">Por que invertir en LIKEN?</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <Benefit text="Inversion minima accesible, sin barreras de capital" />
          <Benefit text="Dividendos mensuales por generacion real de energia" />
          <Benefit text="Liquidez en marketplace P2P, sin lock-up" />
          <Benefit text="Trazabilidad on-chain de cada transaccion" />
        </ul>
      </section>
    </main>
  );
}

function KpiCard({
  icon: Icon, label, value, accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className={`mt-2 truncate text-xl font-bold sm:text-2xl ${accent ? GRADIENT_TEXT : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-2 last:border-0 last:pb-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function TimelineRow({
  label,
  date,
  active,
  hint,
}: {
  label: string;
  date: string | null | undefined;
  active: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
        active ? "bg-primary/20 ring-1 ring-primary" : "bg-secondary"
      }`}>
        <div className={`h-2 w-2 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/30"}`} />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        <p className="shrink-0 text-xs text-muted-foreground">
          {date ? formatDate(date) : hint ?? "Sin definir"}
        </p>
      </div>
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 rounded-lg bg-secondary/40 p-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span className="text-sm text-foreground">{text}</span>
    </li>
  );
}
