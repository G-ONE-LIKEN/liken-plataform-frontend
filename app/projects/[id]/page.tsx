"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, MapPin, Zap, TrendingUp, Coins, Calendar, Target, Wallet,
  CheckCircle2, Sun, Wind, Droplets, Leaf, Info, AlertCircle,
} from "lucide-react";
import { useProjectDetail } from "@/features/projects/hooks/use-projects";
import { Badge } from "@/shared/ui/badge";
import { EmptyState } from "@/shared/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate, formatPercent } from "@/shared/lib/utils";

const ENERGY_ICONS = { SOLAR: Sun, WIND: Wind, HYDRO: Droplets, BIOMASS: Leaf };
const ENERGY_LABELS = {
  SOLAR: "Solar fotovoltaico",
  WIND: "Eólica",
  HYDRO: "Hidroeléctrica",
  BIOMASS: "Biomasa",
};

const STATE_CONFIG: Record<string, { label: string; tone: "success" | "warning" | "neutral" | "danger" }> = {
  PENDING_APPROVAL: { label: "Pendiente de aprobación", tone: "warning" },
  DRAFT:     { label: "Borrador",            tone: "neutral" },
  PRE_OPEN:  { label: "En construcción",     tone: "warning" },
  OPEN:      { label: "Abierto a inversión", tone: "success" },
  CLOSED:    { label: "Cerrado",             tone: "neutral" },
  CANCELLED: { label: "Cancelado",           tone: "danger"  },
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

  const [investAmount, setInvestAmount] = useState("");

  const calcs = useMemo(() => {
    if (!data) return null;
    const tokenPrice = toNum(data.tokenPrice);
    const minimum   = toNum(data.minimumInvestment);
    const apy       = toNum(data.expectedAnnualYield);
    const softCap   = toNum(data.softCap);
    const hardCap   = toNum(data.hardCap);
    const raised    = toNum(data.raisedAmount);
    const inv       = toNum(investAmount);

    return {
      tokensToReceive: tokenPrice > 0 ? inv / tokenPrice : 0,
      estAnnualReturn: inv * (apy / 100),
      estMonthlyReturn: (inv * (apy / 100)) / 12,
      hardCapPct: hardCap > 0 ? Math.min(100, (raised / hardCap) * 100) : 0,
      softCap, hardCap, raised, minimum, tokenPrice, apy,
    };
  }, [data, investAmount]);

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
          description={error instanceof Error ? error.message : "Revisá disponibilidad del servicio de proyectos."}
        />
      </main>
    );
  }

  const EnergyIcon = ENERGY_ICONS[data.energyType] ?? Zap;
  const stateConfig = STATE_CONFIG[data.state] ?? STATE_CONFIG.DRAFT;
  const isOpen = data.state === "OPEN";
  const showRound = calcs && (calcs.softCap > 0 || calcs.hardCap > 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">

      {/* ─── Top bar ───────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>
        <Badge tone={stateConfig.tone}>{stateConfig.label}</Badge>
      </div>

      {/* ─── Hero ──────────────────────────────────── */}
      <header className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/20 ring-1 ring-primary/30 sm:h-16 sm:w-16">
            <EnergyIcon className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
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

      {/* ─── KPIs ──────────────────────────────────── */}
      <section className="mt-6 grid gap-3 grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={TrendingUp} label="Rendimiento anual"
          value={data.expectedAnnualYield ? `${data.expectedAnnualYield}%` : "—"} accent />
        <KpiCard icon={Wallet} label="Inversión mínima"
          value={data.minimumInvestment ? formatCurrency(data.minimumInvestment) : "—"} />
        <KpiCard icon={Coins} label="Precio del token"
          value={data.tokenPrice ? formatCurrency(data.tokenPrice) : "—"} />
        <KpiCard icon={Zap} label="Potencia"
          value={data.installedCapacityMW ? `${data.installedCapacityMW} MW` : "—"} />
      </section>

      {/* ─── Avance de la ronda ───────────────────── */}
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
                    <div className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${calcs!.hardCapPct}%` }} />
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
                  <span className="text-muted-foreground">Soft cap (mínimo viable)</span>
                  <span className="font-medium text-foreground">{formatCurrency(String(calcs!.softCap))}</span>
                </div>
                {data.softCapDeadline && (
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Fecha límite</span>
                    <span className="font-medium text-foreground">{formatDate(data.softCapDeadline)}</span>
                  </div>
                )}
                {calcs!.raised < calcs!.softCap && (
                  <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Info className="mt-0.5 h-3 w-3 shrink-0" />
                    Si no se alcanza el soft cap en la fecha límite, los inversores reciben reembolso total.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Simulador ─────────────────────────────── */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-card">
        <header className="border-b border-border bg-gradient-to-br from-primary/10 to-transparent px-6 py-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Simulá tu inversión</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Calculá cuánto recibirías en base al rendimiento estimado del proyecto.
          </p>
        </header>

        <div className="p-6">
          {/* Input */}
          <div>
            <label htmlFor="invest-amount" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Monto a invertir (USD)
            </label>
            <Input
              id="invest-amount"
              type="number"
              placeholder={data.minimumInvestment || "100"}
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              min={data.minimumInvestment ?? "0"}
              className="mt-1.5 text-lg font-semibold"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Mínimo: <span className="font-medium text-foreground">
                  {data.minimumInvestment ? formatCurrency(data.minimumInvestment) : "—"}
                </span>
              </span>
            </div>
          </div>

          {/* Chips rápidos */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {["100", "500", "1000", "5000"].map((v) => (
              <Button
                key={v}
                variant={investAmount === v ? "default" : "outline"}
                size="sm"
                onClick={() => setInvestAmount(v)}
              >
                ${v}
              </Button>
            ))}
          </div>

          {/* Aviso de mínimo */}
          {calcs && investAmount && toNum(investAmount) > 0 && toNum(investAmount) < calcs.minimum && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-600">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              El monto es menor a la inversión mínima ({formatCurrency(String(calcs.minimum))}).
            </div>
          )}

          {/* Resultados */}
          {calcs && investAmount && toNum(investAmount) > 0 && (
            <div className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard
                  label="Tokens que recibís"
                  value={calcs.tokensToReceive.toFixed(2)}
                  icon={Coins}
                  accent
                />
                <ResultCard
                  label="Ingreso anual estimado"
                  value={formatCurrency(String(calcs.estAnnualReturn))}
                  icon={TrendingUp}
                  accent
                />
              </div>
              <ResultCard
                label="Ingreso mensual estimado"
                value={formatCurrency(String(calcs.estMonthlyReturn))}
                icon={Calendar}
              />
              <p className="text-center text-xs text-muted-foreground">
                Cálculo: {formatCurrency(investAmount)} × {formatPercent(data.expectedAnnualYield)} APY anual
              </p>
            </div>
          )}

          {/* Empty state */}
          {(!investAmount || toNum(investAmount) <= 0) && (
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-dashed border-border bg-secondary/30 px-5 py-6 text-sm text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 text-primary/60" />
              <span>Ingresá un monto para ver tu rendimiento estimado y cuántos tokens recibirías.</span>
            </div>
          )}

          {/* CTA */}
          <Button className="mt-8 w-full" size="lg" disabled={!isOpen}>
            {isOpen ? "Invertir ahora" : `Ronda no disponible (${stateConfig.label})`}
          </Button>
        </div>
      </section>

      {/* ─── Cronograma + Detalles técnicos ───────── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Cronograma</h2>
          </div>
          <div className="space-y-3">
            <TimelineRow label="Inicio de fondeo" date={data.startDate}
              active={["DRAFT","PRE_OPEN","OPEN"].includes(data.state)} />
            <TimelineRow label="Apertura del parque" date={data.expectedOpenDate}
              active={["OPEN","CLOSED"].includes(data.state)} />
            <TimelineRow label="Fin de la inversión" date={data.endDate}
              active={data.state === "CLOSED"} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold text-foreground">Detalles técnicos</h2>
          <dl className="space-y-3 text-sm">
            <DetailRow label="Tipo de energía" value={ENERGY_LABELS[data.energyType]} />
            <DetailRow label="Potencia instalada"
              value={data.installedCapacityMW ? `${data.installedCapacityMW} MW` : "—"} />
            {data.expectedAnnualProductionMWh && (
              <DetailRow label="Producción anual estimada"
                value={`${data.expectedAnnualProductionMWh} MWh`} />
            )}
            <DetailRow label="Tokens totales emitidos" value={data.totalTokens ?? "—"} />
            <DetailRow label="Ubicación" value={`${data.province}, ${data.country}`} />
          </dl>
        </section>
      </div>

      {/* ─── Por qué invertir ─────────────────────── */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground">¿Por qué invertir en LIKEN?</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <Benefit text="Inversión mínima accesible, sin barreras de capital" />
          <Benefit text="Dividendos mensuales por generación real de energía" />
          <Benefit text="Liquidez en marketplace P2P, sin lock-up" />
          <Benefit text="Trazabilidad on-chain de cada transacción" />
        </ul>
      </section>
    </main>
  );
}

// ── Subcomponentes ─────────────────────────────────

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
      <p className={`mt-2 truncate text-xl font-bold sm:text-2xl ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
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

function TimelineRow({ label, date, active }: { label: string; date: string | undefined; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
        active ? "bg-primary/20 ring-1 ring-primary" : "bg-secondary"
      }`}>
        <div className={`h-2 w-2 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/30"}`} />
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        <p className="shrink-0 text-xs text-muted-foreground">{date ? formatDate(date) : "Sin definir"}</p>
      </div>
    </div>
  );
}

function ResultCard({
  label, value, icon: Icon, accent,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/30"}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className={`mt-3 truncate text-2xl font-bold ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
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
