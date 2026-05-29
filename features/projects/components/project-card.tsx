import Link from "next/link";
import { ArrowUpRight, MapPin, Zap } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { formatCurrency, formatDate, formatPercent } from "@/shared/lib/utils";
import type { ProjectSummary } from "@/features/projects/types/projects";

function getStateTone(state: ProjectSummary["state"]) {
  if (state === "OPEN") return "success";
  if (state === "PRE_OPEN") return "brand";
  if (state === "CANCELLED") return "danger";
  if (state === "CLOSED") return "warning";
  return "neutral";
}

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Card
      title={project.name}
      description={project.description}
      actions={<Badge tone={getStateTone(project.state)}>{project.state}</Badge>}
    >
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-foreground-muted)]">
          <span className="inline-flex items-center gap-2">
            <Zap className="h-4 w-4 text-[var(--color-accent)]" />
            {project.energyType}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--color-foreground-subtle)]" />
            {project.province}, {project.country}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <Metric label="Minimo" value={formatCurrency(project.minimumInvestment)} />
          <Metric label="Yield" value={formatPercent(project.expectedAnnualYield)} />
          <Metric label="Token" value={formatCurrency(project.tokenPrice)} />
          <Metric label="Inicio" value={formatDate(project.startDate)} />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
          <div className="text-xs text-[var(--color-foreground-subtle)]">
            Catalogo operativo listo para leer desde el gateway actual.
          </div>
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary-strong)] transition hover:text-[var(--color-primary)]"
          >
            Abrir detalle
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-[var(--color-foreground)]">{value}</div>
    </div>
  );
}
