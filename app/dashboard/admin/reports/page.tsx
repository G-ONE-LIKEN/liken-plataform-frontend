"use client";

import { useState } from "react";
import {
  TrendingUp, Coins, Activity, Calendar, BarChart3, Loader2, ArrowDownToLine, ArrowUpFromLine, Percent,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { AccessGate } from "@/features/auth/components/access-gate";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlatformReport, type MonthlyPoint } from "@/features/admin/hooks/use-platform-report";
import { formatCurrency } from "@/shared/lib/utils";

function defaultRange() {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth() - 11, 1);
  const to = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}

function ReportContent() {
  const [range, setRange] = useState(defaultRange);
  const [pending, setPending] = useState(range);
  const query = usePlatformReport(range);
  const data = query.data;

  function apply() {
    setRange(pending);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administración"
        title="Informe de ingresos"
        description="Comisiones cobradas por la plataforma sobre inversión primaria y mercado P2P."
      />

      {/* Filtros */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="from" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3 w-3" /> Desde
            </Label>
            <Input
              id="from"
              type="date"
              value={pending.from}
              onChange={(e) => setPending((r) => ({ ...r, from: e.target.value }))}
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="to" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3 w-3" /> Hasta
            </Label>
            <Input
              id="to"
              type="date"
              value={pending.to}
              onChange={(e) => setPending((r) => ({ ...r, to: e.target.value }))}
            />
          </div>
          <Button onClick={apply} disabled={query.isFetching} className="gap-1.5">
            {query.isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
            Actualizar
          </Button>
        </div>

        {data && (
          <div className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
            <FeeRateInfo
              label="Comisión inversión primaria"
              rate={data.primaryFeeRate}
              description="Aplicada sobre cada compra de tokens del proyecto."
            />
            <FeeRateInfo
              label="Comisión mercado P2P"
              rate={data.p2pFeeRate}
              description="Aplicada sobre cada operación de compra/venta entre usuarios."
            />
          </div>
        )}
      </div>

      {query.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">No se pudo cargar el informe.</p>
      ) : (
        <>
          {/* KPI principal: ingresos totales */}
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Ingreso de la plataforma</p>
                <p className="mt-1 text-4xl font-bold text-foreground sm:text-5xl">
                  {formatCurrency(data.totalRevenue)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Período: {data.from} → {data.to}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <TrendingUp className="h-7 w-7" />
              </div>
            </div>
          </div>

          {/* Desglose por fuente */}
          <div className="grid gap-4 sm:grid-cols-2">
            <RevenueSourceCard
              icon={Coins}
              label="Por inversión primaria"
              fees={data.primaryFees}
              volume={data.primaryVolume}
              operations={data.primaryOperations}
              rate={data.primaryFeeRate}
            />
            <RevenueSourceCard
              icon={Activity}
              label="Por mercado P2P"
              fees={data.p2pFees}
              volume={data.p2pVolume}
              operations={data.p2pOperations}
              rate={data.p2pFeeRate}
            />
          </div>

          {/* Gráfico de ingresos por mes */}
          <Section title="Ingresos por mes" description="Comisiones cobradas en el período.">
            <RevenueChart data={data.monthly} />
          </Section>

          {/* Gráfico de fees desglosado */}
          <Section title="Ingresos por fuente" description="Cuánto aporta cada línea de comisión al total.">
            <FeesBreakdownChart data={data.monthly} />
          </Section>

          {/* Contexto: cash flow */}
          <Section title="Movimiento de fondos en la plataforma" description="Depósitos y retiros de los usuarios. No forman parte del revenue.">
            <div className="grid gap-4 sm:grid-cols-2">
              <ContextCard icon={ArrowDownToLine} label="Depósitos" value={formatCurrency(data.totalDeposits)} tone="success" />
              <ContextCard icon={ArrowUpFromLine} label="Retiros"    value={formatCurrency(data.totalWithdrawals)} tone="danger" />
            </div>
          </Section>
        </>
      )}
    </div>
  );
}

function FeeRateInfo({ label, rate, description }: { label: string; rate: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
        <Percent className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{(Number(rate) * 100).toFixed(2)}%</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function RevenueSourceCard({
  icon: Icon,
  label,
  fees,
  volume,
  operations,
  rate,
}: {
  icon: React.ElementType;
  label: string;
  fees: string;
  volume: string;
  operations: number;
  rate: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(fees)}</p>
          <p className="text-xs text-muted-foreground">
            Comisión {(Number(rate) * 100).toFixed(2)}%
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
        <div>
          <p className="font-semibold uppercase tracking-wider text-muted-foreground">Volumen</p>
          <p className="mt-0.5 font-medium text-foreground">{formatCurrency(volume)}</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wider text-muted-foreground">Operaciones</p>
          <p className="mt-0.5 font-medium text-foreground">{operations}</p>
        </div>
      </div>
    </div>
  );
}

function ContextCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: "success" | "danger";
}) {
  const tones = {
    success: "border-green-500/30 bg-green-500/10 text-green-500",
    danger:  "border-red-500/30   bg-red-500/10   text-red-500",
  } as const;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4">
        <h2 className="font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function chartData(points: MonthlyPoint[]) {
  return points.map((p) => ({
    period: p.period,
    revenue: Number(p.revenue),
    primaryFees: Number(p.primaryFees),
    p2pFees: Number(p.p2pFees),
  }));
}

function tickCurrency(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000)     return `${(value / 1_000).toFixed(1)}k`;
  return value.toString();
}

function RevenueChart({ data }: { data: MonthlyPoint[] }) {
  const series = chartData(data);
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="period" stroke="var(--color-muted-foreground)" fontSize={11} />
          <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={tickCurrency} />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
            }}
            formatter={(v: number) => formatCurrency(v)}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#revGrad)"
            name="Ingreso"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function FeesBreakdownChart({ data }: { data: MonthlyPoint[] }) {
  const series = chartData(data);
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={series} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="period" stroke="var(--color-muted-foreground)" fontSize={11} />
          <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={tickCurrency} />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
            }}
            formatter={(v: number) => formatCurrency(v)}
          />
          <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
          <Bar
            dataKey="primaryFees"
            stackId="fees"
            name="Inversión primaria"
            fill="oklch(0.72 0.16 165)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="p2pFees"
            stackId="fees"
            name="Mercado P2P"
            fill="oklch(0.65 0.18 235)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <AccessGate allow={(ctx) => ctx.isAdmin}>
      <ReportContent />
    </AccessGate>
  );
}
