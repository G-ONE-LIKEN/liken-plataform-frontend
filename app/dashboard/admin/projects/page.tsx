"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2, XCircle, Clock, Loader2, Zap, Eye, AlertTriangle, Activity, Archive,
  Sun, Wind, Droplets, Leaf, TrendingUp, Users as UsersIcon, MapPin,
} from "lucide-react";
import { AccessGate } from "@/features/auth/components/access-gate";
import { PageHeader } from "@/shared/ui/page-header";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useProjectsByState } from "@/features/projects/hooks/use-projects";
import { useApproveProject, useRejectProject } from "@/features/projects/hooks/use-project-mutations";
import { formatCurrency, formatDate, formatPercent } from "@/shared/lib/utils";
import type { ProjectSummary, EnergyType } from "@/features/projects/types/projects";

const ENERGY_ICONS: Record<EnergyType, React.ElementType> = {
  SOLAR: Sun, WIND: Wind, HYDRO: Droplets, BIOMASS: Leaf,
};

function toNum(v: string | undefined | null): number {
  if (v == null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

// ───────────────────────────────────────────────────────────────────
// Pending Card (con acciones aprobar/rechazar)
// ───────────────────────────────────────────────────────────────────

function PendingCard({ project }: { project: ProjectSummary }) {
  const approve = useApproveProject();
  const reject = useRejectProject();
  const [pending, setPending] = useState<"APPROVE" | "REJECT" | null>(null);
  const [reason, setReason] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);

  const EnergyIcon = ENERGY_ICONS[project.energyType] ?? Zap;

  async function handleApprove() {
    setPending("APPROVE");
    try {
      await approve.mutateAsync(project.id);
      toast({ title: "Proyecto aprobado", description: project.name });
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
      await reject.mutateAsync({ id: project.id, reason: reason.trim() || undefined });
      toast({ title: "Proyecto rechazado", description: project.name });
      setRejectOpen(false);
      setReason("");
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
    <>
      <div className="rounded-xl border border-border/50 bg-card px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <EnergyIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{project.name}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span>ID #{project.id}</span>
                <span>•</span>
                <span>{project.energyType}</span>
                <span>•</span>
                <span>Owner #{project.ownerId}</span>
                <span>•</span>
                <span>{project.totalTokens} LKN @ {project.tokenPrice}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <Badge tone="warning">Pendiente</Badge>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <Link href={`/dashboard/admin/projects/${project.id}`}>
                  <Eye className="h-3.5 w-3.5" />
                  Revisar
                </Link>
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
                disabled={!!pending}
                onClick={handleApprove}
              >
                {pending === "APPROVE" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                Aprobar
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
                disabled={!!pending}
                onClick={() => setRejectOpen(true)}
              >
                <XCircle className="h-3.5 w-3.5" />
                Rechazar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={(open) => { if (!pending) setRejectOpen(open); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <DialogTitle>Rechazar proyecto</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              Vas a rechazar <span className="font-medium text-foreground">{project.name}</span>. El developer recibirá el motivo que indiques.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label htmlFor={`reason-${project.id}`} className="text-sm font-medium text-foreground">
              Motivo del rechazo <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
            </label>
            <Textarea
              id={`reason-${project.id}`}
              placeholder="Ej: La documentación técnica está incompleta..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" disabled={!!pending} onClick={() => setRejectOpen(false)}>
              Cancelar
            </Button>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ───────────────────────────────────────────────────────────────────
// Active Card (con métricas reales: recaudación, %, holders)
// ───────────────────────────────────────────────────────────────────

const ACTIVE_STATE_BADGE: Record<string, { label: string; tone: "warning" | "success" | "neutral" | "brand" }> = {
  DRAFT:    { label: "Borrador",         tone: "neutral" },
  PRE_OPEN: { label: "En pre-apertura",  tone: "warning" },
  OPEN:     { label: "Abierto",          tone: "success" },
};

function ActiveCard({ project }: { project: ProjectSummary }) {
  const EnergyIcon = ENERGY_ICONS[project.energyType] ?? Zap;
  const badge = ACTIVE_STATE_BADGE[project.state] ?? ACTIVE_STATE_BADGE.DRAFT;
  const raised = toNum(project.raisedAmount);
  const hardCap = toNum(project.hardCap);
  const softCap = toNum(project.softCap);
  const pct = hardCap > 0 ? Math.min(100, (raised / hardCap) * 100) : 0;
  const softCapReached = softCap > 0 && raised >= softCap;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 text-primary">
          <EnergyIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold text-foreground">{project.name}</h3>
            <Badge tone={badge.tone}>{badge.label}</Badge>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {project.province ? `${project.province}, ${project.country}` : project.country}
          </p>
        </div>
      </div>

      {hardCap > 0 && (
        <div className="mt-4 space-y-1.5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-muted-foreground">Recaudación</span>
            <span className="font-semibold text-foreground">{pct.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-foreground">{formatCurrency(String(raised))}</span>
            <span className="text-muted-foreground">de {formatCurrency(String(hardCap))}</span>
          </div>
          {softCap > 0 && (
            <p className={`text-[11px] ${softCapReached ? "text-green-500" : "text-muted-foreground"}`}>
              {softCapReached ? "✓ Soft cap alcanzado" : `Soft cap: ${formatCurrency(String(softCap))}`}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
        <Metric label="APY estimado" value={formatPercent(project.expectedAnnualYield)} />
        <Metric label="Token" value={formatCurrency(project.tokenPrice)} />
        <Metric label="Owner" value={`#${project.ownerId}`} />
        <Metric label="Inicio" value={project.startDate ? formatDate(project.startDate) : "—"} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">ID #{project.id}</span>
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <Link href={`/dashboard/admin/projects/${project.id}`}>
            <Eye className="h-3.5 w-3.5" />
            Ver detalle
          </Link>
        </Button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-medium text-foreground">{value}</p>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Finished Card (CLOSED + CANCELLED — solo lectura, sin métricas vivas)
// ───────────────────────────────────────────────────────────────────

const FINISHED_BADGE: Record<string, { label: string; tone: "neutral" | "danger" }> = {
  CLOSED:    { label: "Cerrado",  tone: "neutral" },
  CANCELLED: { label: "Cancelado", tone: "danger" },
};

function FinishedCard({ project }: { project: ProjectSummary }) {
  const EnergyIcon = ENERGY_ICONS[project.energyType] ?? Zap;
  const badge = FINISHED_BADGE[project.state] ?? FINISHED_BADGE.CLOSED;

  return (
    <div className="rounded-xl border border-border/50 bg-card px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
            <EnergyIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{project.name}</p>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{project.description}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span>ID #{project.id}</span>
              <span>•</span>
              <span>{project.energyType}</span>
              <span>•</span>
              <span>Owner #{project.ownerId}</span>
              {toNum(project.raisedAmount) > 0 && (
                <>
                  <span>•</span>
                  <span>Recaudó {formatCurrency(project.raisedAmount)}</span>
                </>
              )}
            </div>
            {project.state === "CANCELLED" && project.rejectionReason && (
              <p className="mt-2 text-xs text-destructive">Motivo: {project.rejectionReason}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge tone={badge.tone}>{badge.label}</Badge>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link href={`/dashboard/admin/projects/${project.id}`}>
              <Eye className="h-3.5 w-3.5" />
              Ver
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────

function EmptyState({ icon: Icon, title, hint }: { icon: React.ElementType; title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <Icon className="mb-3 h-8 w-8 text-muted-foreground/40" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Tabs
// ───────────────────────────────────────────────────────────────────

function PendingTab() {
  const query = useProjectsByState("PENDING_APPROVAL");
  const items = query.data?.content ?? [];

  if (query.isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    );
  }
  if (items.length === 0) {
    return <EmptyState icon={CheckCircle2} title="Sin proyectos pendientes" hint="Todas las propuestas fueron revisadas." />;
  }
  return (
    <div className="space-y-3">
      {items.map((p) => <PendingCard key={p.id} project={p} />)}
    </div>
  );
}

function ActiveTab() {
  const draftQ = useProjectsByState("DRAFT");
  const preOpenQ = useProjectsByState("PRE_OPEN");
  const openQ = useProjectsByState("OPEN");

  const items = useMemo(() => [
    ...(openQ.data?.content ?? []),
    ...(preOpenQ.data?.content ?? []),
    ...(draftQ.data?.content ?? []),
  ], [draftQ.data, preOpenQ.data, openQ.data]);

  const loading = draftQ.isLoading || preOpenQ.isLoading || openQ.isLoading;

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
      </div>
    );
  }
  if (items.length === 0) {
    return <EmptyState icon={Activity} title="Sin proyectos activos" hint="No hay proyectos en captación ni borradores aprobados." />;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => <ActiveCard key={p.id} project={p} />)}
    </div>
  );
}

function FinishedTab() {
  const closedQ = useProjectsByState("CLOSED");
  const cancelledQ = useProjectsByState("CANCELLED");

  const items = useMemo(() => [
    ...(closedQ.data?.content ?? []),
    ...(cancelledQ.data?.content ?? []),
  ], [closedQ.data, cancelledQ.data]);

  const loading = closedQ.isLoading || cancelledQ.isLoading;

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }
  if (items.length === 0) {
    return <EmptyState icon={Archive} title="Sin proyectos finalizados" hint="Todavía no hay proyectos cerrados ni cancelados." />;
  }
  return (
    <div className="space-y-3">
      {items.map((p) => <FinishedCard key={p.id} project={p} />)}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────

function ProjectsAdminContent() {
  const pendingQ = useProjectsByState("PENDING_APPROVAL");
  const openQ = useProjectsByState("OPEN");
  const closedQ = useProjectsByState("CLOSED");

  const pendingCount = pendingQ.data?.content?.length ?? 0;
  const openCount = openQ.data?.content?.length ?? 0;
  const closedCount = closedQ.data?.content?.length ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administración"
        title="Proyectos"
        description="Revisá propuestas pendientes, monitoreá la captación de los activos y consultá los finalizados."
      />

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pendientes
            {pendingCount > 0 && (
              <span className="rounded-full bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-500">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <Activity className="h-4 w-4" />
            Activos
            {openCount > 0 && (
              <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[10px] font-bold text-green-500">
                {openCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="finished" className="gap-2">
            <Archive className="h-4 w-4" />
            Finalizados
            {closedCount > 0 && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                {closedCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <PendingTab />
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          <ActiveTab />
        </TabsContent>
        <TabsContent value="finished" className="mt-6">
          <FinishedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <AccessGate allow={(ctx) => ctx.isAdmin}>
      <ProjectsAdminContent />
    </AccessGate>
  );
}
