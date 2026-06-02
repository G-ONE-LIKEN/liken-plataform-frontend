"use client";

import Link from "next/link";
import {
  Users, ShieldCheck, Building2, FolderKanban, TrendingUp, ArrowRight, CheckCircle2,
  Zap, Activity, Coins, Sun, Wind, Droplets, Leaf,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useSession } from "@/providers/session-provider";
import { useUsers } from "@/features/admin/hooks/use-users";
import { useDevelopers } from "@/features/admin/hooks/use-developers";
import { useProjects, usePendingApprovalProjects } from "@/features/projects/hooks/use-projects";
import { usePlatformReport } from "@/features/admin/hooks/use-platform-report";
import { formatCurrency } from "@/shared/lib/utils";
import type { EnergyType, ProjectSummary } from "@/features/projects/types/projects";

const ENERGY_ICONS: Record<EnergyType, React.ElementType> = {
  SOLAR: Sun, WIND: Wind, HYDRO: Droplets, BIOMASS: Leaf,
};

function defaultMonthlyRange() {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  const to = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}

export function AdminDashboard() {
  const { user } = useSession();
  const displayName = user?.firstName || user?.email?.split("@")[0] || "admin";

  const usersQuery = useUsers();
  const pendingDevsQuery = useDevelopers("PENDING");
  const pendingProjectsQuery = usePendingApprovalProjects();
  const monthlyReportQuery = usePlatformReport(defaultMonthlyRange());
  const projectsQuery = useProjects();

  const totalUsers = usersQuery.data?.content?.length ?? null;
  const pendingDevs = pendingDevsQuery.data?.content ?? [];
  const pendingProjects = pendingProjectsQuery.data?.content ?? [];
  const monthlyRevenue = monthlyReportQuery.data?.totalRevenue ?? "0";
  const monthlyP2pVolume = monthlyReportQuery.data?.p2pVolume ?? "0";
  const monthlyP2pOps = monthlyReportQuery.data?.p2pOperations ?? 0;

  // Proyectos en captación / abiertos para el snapshot de mercado
  const allProjects = projectsQuery.data?.content ?? [];
  const openProjects = allProjects.filter((p) => p.state === "OPEN" || p.state === "PRE_OPEN");
  const stateCounts = countByState(allProjects);

  const hasPendingWork = pendingDevs.length > 0 || pendingProjects.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Administración</p>
        <h1 className="mt-1 text-3xl font-bold text-foreground">Hola, {displayName}</h1>
        <p className="mt-1 text-muted-foreground">
          {hasPendingWork
            ? "Tenés tareas de revisión pendientes. Empezá por las cards de abajo."
            : "Todo al día. Resumen rápido del estado de la plataforma."}
        </p>
      </div>

      {/* KPIs admin */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={TrendingUp}
          label="Ingresos del mes"
          value={monthlyReportQuery.isLoading ? null : formatCurrency(monthlyRevenue)}
          hint="Comisiones cobradas"
          tone="brand"
          href="/dashboard/admin/reports"
        />
        <KpiCard
          icon={Users}
          label="Usuarios totales"
          value={usersQuery.isLoading ? null : (totalUsers != null ? String(totalUsers) : "—")}
          hint="Cuentas activas"
          tone="info"
          href="/dashboard/users"
        />
        <KpiCard
          icon={Building2}
          label="Developers por revisar"
          value={pendingDevsQuery.isLoading ? null : String(pendingDevs.length)}
          hint={pendingDevs.length > 0 ? "Acción pendiente" : "Sin pendientes"}
          tone={pendingDevs.length > 0 ? "warning" : "neutral"}
          href="/dashboard/admin/developers"
        />
        <KpiCard
          icon={FolderKanban}
          label="Proyectos por revisar"
          value={pendingProjectsQuery.isLoading ? null : String(pendingProjects.length)}
          hint={pendingProjects.length > 0 ? "Acción pendiente" : "Sin pendientes"}
          tone={pendingProjects.length > 0 ? "warning" : "neutral"}
          href="/dashboard/admin/projects"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Proyectos pendientes */}
        <Panel
          title="Proyectos pendientes"
          subtitle="Propuestas que esperan tu aprobación."
          href="/dashboard/admin/projects"
          ctaLabel="Revisar todos"
          empty={pendingProjects.length === 0}
          loading={pendingProjectsQuery.isLoading}
          emptyText="Sin proyectos pendientes."
        >
          {pendingProjects.slice(0, 4).map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/admin/projects/${p.id}`}
              className="group flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                  <Badge tone="warning">Pendiente</Badge>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {p.energyType} · Owner #{p.ownerId} · {p.totalTokens} LKN @ {p.tokenPrice}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </Panel>

        {/* Developers pendientes */}
        <Panel
          title="Developers pendientes"
          subtitle="Cuentas que esperan verificación."
          href="/dashboard/admin/developers"
          ctaLabel="Verificar todos"
          empty={pendingDevs.length === 0}
          loading={pendingDevsQuery.isLoading}
          emptyText="Sin developers pendientes."
        >
          {pendingDevs.slice(0, 4).map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{u.email}</p>
                <p className="text-xs text-muted-foreground">ID #{u.id}</p>
              </div>
              <Badge tone="warning">Pendiente</Badge>
            </div>
          ))}
        </Panel>
      </div>

      {/* Snapshot del mercado P2P */}
      <Panel
        title="Mercado P2P · este mes"
        subtitle="Actividad del mercado secundario y valor de los tokens en captación."
        href="/dashboard/admin/reports"
        ctaLabel="Ver informe"
        empty={false}
        loading={monthlyReportQuery.isLoading || projectsQuery.isLoading}
        emptyText=""
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <MiniStat
            icon={Activity}
            label="Volumen P2P"
            value={formatCurrency(monthlyP2pVolume)}
          />
          <MiniStat
            icon={Coins}
            label="Operaciones P2P"
            value={String(monthlyP2pOps)}
          />
          <MiniStat
            icon={FolderKanban}
            label="Proyectos activos"
            value={String(openProjects.length)}
          />
        </div>

        {openProjects.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Precio del token por proyecto activo
            </p>
            {openProjects.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {(() => {
                    const Icon = ENERGY_ICONS[p.energyType] ?? Zap;
                    return <Icon className="h-4 w-4" />;
                  })()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.energyType} · {p.totalTokens} LKN totales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{formatCurrency(p.tokenPrice)}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">por token</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        )}
      </Panel>

      {/* Estado del catálogo de proyectos */}
      <Panel
        title="Catálogo de proyectos"
        subtitle="Distribución por estado en toda la plataforma."
        href="/dashboard/projects"
        ctaLabel="Ver catálogo"
        empty={allProjects.length === 0}
        loading={projectsQuery.isLoading}
        emptyText="Todavía no hay proyectos publicados."
      >
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <StateCount label="Pendientes"      count={stateCounts.PENDING_APPROVAL} tone="warning" />
          <StateCount label="Borradores"      count={stateCounts.DRAFT}            tone="neutral" />
          <StateCount label="En captación"    count={stateCounts.PRE_OPEN}         tone="info" />
          <StateCount label="Abiertos"        count={stateCounts.OPEN}             tone="success" />
          <StateCount label="Cerrados/Cancel."count={stateCounts.CLOSED + stateCounts.CANCELLED} tone="muted" />
        </div>
      </Panel>

      {/* Atajos */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Atajos</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ShortcutLink href="/dashboard/admin/reports"  icon={TrendingUp} label="Informe de ingresos" />
          <ShortcutLink href="/dashboard/users"          icon={Users}      label="Gestión de usuarios" />
          <ShortcutLink href="/dashboard/admin/roles"    icon={ShieldCheck} label="Roles y permisos" />
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null;
  hint?: string;
  tone: "brand" | "info" | "warning" | "neutral";
  href?: string;
}) {
  const tones = {
    brand:   "border-primary/30   bg-primary/10    text-primary",
    info:    "border-sky-500/30   bg-sky-500/10    text-sky-500",
    warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
    neutral: "border-border       bg-secondary/40  text-foreground",
  } as const;

  const content = (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          {value == null ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl font-bold text-foreground">{value}</p>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function Panel({
  title,
  subtitle,
  href,
  ctaLabel,
  empty,
  loading,
  emptyText,
  children,
}: {
  title: string;
  subtitle?: string;
  href: string;
  ctaLabel: string;
  empty: boolean;
  loading: boolean;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={href} className="gap-1.5">
            {ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
        </div>
      ) : empty ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center">
          <CheckCircle2 className="mb-2 h-6 w-6 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function StateCount({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "warning" | "neutral" | "info" | "success" | "muted";
}) {
  const tones = {
    warning: "border-yellow-500/30 text-yellow-500",
    neutral: "border-border text-foreground",
    info:    "border-sky-500/30 text-sky-500",
    success: "border-green-500/30 text-green-500",
    muted:   "border-border text-muted-foreground",
  } as const;
  return (
    <div className={`rounded-lg border bg-secondary/30 px-3 py-3 text-center ${tones[tone]}`}>
      <p className="text-2xl font-bold">{count}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider">{label}</p>
    </div>
  );
}

function countByState(projects: ProjectSummary[]) {
  const counts: Record<string, number> = {
    PENDING_APPROVAL: 0, DRAFT: 0, PRE_OPEN: 0, OPEN: 0, CLOSED: 0, CANCELLED: 0,
  };
  for (const p of projects) counts[p.state] = (counts[p.state] ?? 0) + 1;
  return counts as Record<"PENDING_APPROVAL" | "DRAFT" | "PRE_OPEN" | "OPEN" | "CLOSED" | "CANCELLED", number>;
}

function ShortcutLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3 transition-colors hover:border-primary/30 hover:bg-secondary"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
