"use client";

import Link from "next/link";
import {
  FolderKanban, Clock, CheckCircle2, XCircle, AlertCircle, Eye, Sun, Wind, Droplets, Leaf, Zap, MapPin, Plus,
} from "lucide-react";
import { AccessGate } from "@/features/auth/components/access-gate";
import { PageHeader } from "@/shared/ui/page-header";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { useMyProjects } from "@/features/projects/hooks/use-projects";
import type { ProjectSummary, ProjectState } from "@/features/projects/types/projects";
import { formatCurrency, formatDate, formatPercent } from "@/shared/lib/utils";

const ENERGY_ICONS = { SOLAR: Sun, WIND: Wind, HYDRO: Droplets, BIOMASS: Leaf };

const STATE_CONFIG: Record<
  ProjectState,
  { label: string; tone: "warning" | "success" | "neutral" | "danger" | "brand"; description: string }
> = {
  PENDING_APPROVAL: {
    label: "Pendiente de aprobación",
    tone: "warning",
    description: "Un administrador todavía no revisó esta propuesta.",
  },
  DRAFT: {
    label: "Borrador",
    tone: "neutral",
    description: "Aprobado. Listo para avanzar a captación.",
  },
  PRE_OPEN: {
    label: "En captación",
    tone: "brand",
    description: "Pre-apertura activa.",
  },
  OPEN: {
    label: "Abierto a inversión",
    tone: "success",
    description: "Los inversores ya pueden invertir.",
  },
  CLOSED: {
    label: "Cerrado",
    tone: "neutral",
    description: "Proyecto finalizado.",
  },
  CANCELLED: {
    label: "Cancelado / Rechazado",
    tone: "danger",
    description: "El proyecto fue cancelado o rechazado por administración.",
  },
};

function MyProjectCard({ project }: { project: ProjectSummary }) {
  const cfg = STATE_CONFIG[project.state];
  const EnergyIcon = ENERGY_ICONS[project.energyType] ?? Zap;
  const wasRejected = project.state === "CANCELLED" && project.rejectionReason;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <EnergyIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold text-foreground">{project.name}</h3>
            <Badge tone={cfg.tone}>{cfg.label}</Badge>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{cfg.description}</p>

      {wasRejected && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-destructive">Motivo</p>
            <p className="mt-0.5 text-xs text-foreground">{project.rejectionReason}</p>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Metric label="Tokens" value={project.totalTokens} />
        <Metric label="Precio" value={formatCurrency(project.tokenPrice)} />
        <Metric label="Yield" value={formatPercent(project.expectedAnnualYield)} />
        <Metric label="Inicio" value={project.startDate ? formatDate(project.startDate) : "—"} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {project.province ? `${project.province}, ${project.country}` : project.country}
        </span>
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <Link href={`/projects/${project.id}`}>
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
    <div className="rounded-md border border-border/60 bg-secondary/40 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-medium text-foreground">{value}</p>
    </div>
  );
}

function StatusSummary({ projects }: { projects: ProjectSummary[] }) {
  const counts = projects.reduce(
    (acc, p) => {
      if (p.state === "PENDING_APPROVAL") acc.pending++;
      else if (p.state === "CANCELLED") acc.rejected++;
      else acc.approved++;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0 },
  );

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryCard icon={Clock} label="Pendientes" value={counts.pending} tone="warning" />
      <SummaryCard icon={CheckCircle2} label="Aprobados / Activos" value={counts.approved} tone="success" />
      <SummaryCard icon={XCircle} label="Rechazados / Cancelados" value={counts.rejected} tone="danger" />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  tone: "warning" | "success" | "danger";
}) {
  const tones = {
    warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    success: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300",
    danger: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  } as const;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MyProjectsContent() {
  const query = useMyProjects();
  const projects = query.data?.content ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          eyebrow="Mis proyectos"
          title="Mis proyectos"
          description="Gestioná tus propuestas y seguí el estado de aprobación, captación e inversión."
        />
        <CreateProjectDialog />
      </div>

      {query.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 rounded-xl" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <FolderKanban className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">Todavía no creaste ningún proyecto</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Creá tu primera propuesta. Una vez enviada, quedará a la espera de aprobación de un administrador.
          </p>
          <div className="mt-5">
            <CreateProjectDialog />
          </div>
        </div>
      ) : (
        <>
          <StatusSummary projects={projects} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <MyProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function MyProjectsPage() {
  return (
    <AccessGate allow={(ctx) => ctx.canManageProjects}>
      <MyProjectsContent />
    </AccessGate>
  );
}
