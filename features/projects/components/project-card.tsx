import Link from "next/link";
import { ArrowUpRight, MapPin, Zap, ExternalLink } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { formatCurrency, formatDate, formatPercent } from "@/shared/lib/utils";
import { explorerAddressUrl } from "@/features/web3/lib/contracts";
import type { ProjectSummary, OnChainStatus, RoundState } from "@/features/projects/types/projects";

function getStateTone(state: ProjectSummary["state"]) {
  if (state === "OPEN") return "success";
  if (state === "PRE_OPEN") return "brand";
  if (state === "CANCELLED") return "danger";
  if (state === "CLOSED") return "warning";
  if (state === "PENDING_APPROVAL") return "warning";
  return "neutral";
}

function getStateLabel(state: ProjectSummary["state"]) {
  if (state === "PENDING_APPROVAL") return "PENDIENTE";
  return state;
}

function priceLabel(state: ProjectSummary["state"]) {
  // Bajo el modelo Fase 6:
  //   PRE_OPEN → precio promocional (Registry FUNDING)
  //   OPEN     → precio final, parque operativo (Registry ACTIVE)
  //   CLOSED   → proyecto dado de baja (histórico)
  if (state === "PRE_OPEN") return "Early bird";
  if (state === "OPEN") return "Standard";
  return "Token";
}

const ROUND_STATE_TONE: Record<RoundState, "success" | "warning" | "danger" | "neutral"> = {
  PENDING: "neutral",
  OPEN: "success",
  FINALIZED: "warning",
  FAILED: "danger",
};

const ROUND_STATE_LABEL: Record<RoundState, string> = {
  PENDING: "Ronda pendiente",
  OPEN: "Ronda abierta",
  FINALIZED: "Ronda finalizada",
  FAILED: "Ronda fallida",
};

const ON_CHAIN_STATUS_TONE: Record<OnChainStatus, "success" | "warning" | "danger" | "neutral"> = {
  NOT_DEPLOYED: "neutral",
  DEPLOYING: "warning",
  DEPLOYED: "success",
  FAILED: "danger",
};

const ON_CHAIN_STATUS_LABEL: Record<OnChainStatus, string> = {
  NOT_DEPLOYED: "Sin contrato",
  DEPLOYING: "Desplegando",
  DEPLOYED: "On-chain",
  FAILED: "Deploy falló",
};

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Card
      title={project.name}
      description={project.description}
      actions={
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={getStateTone(project.state)}>{getStateLabel(project.state)}</Badge>
          {project.roundState && (
            <Badge tone={ROUND_STATE_TONE[project.roundState]}>
              {ROUND_STATE_LABEL[project.roundState]}
            </Badge>
          )}
          <Badge tone={ON_CHAIN_STATUS_TONE[project.onChainStatus]}>
            {ON_CHAIN_STATUS_LABEL[project.onChainStatus]}
          </Badge>
        </div>
      }
      className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[0_22px_50px_-30px_oklch(0.72_0.16_165/0.7)]"
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
          <Metric label="Yield" value={formatPercent(project.expectedAnnualYield)} accent />
          <Metric label={priceLabel(project.state)} value={formatCurrency(project.currentPrice)} />
          <Metric
            label="Apertura"
            value={project.expectedOpenDate ? formatDate(project.expectedOpenDate) : "—"}
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
          {project.offeringContractAddress ? (
            <a
              href={explorerAddressUrl(project.offeringContractAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--color-foreground-subtle)] transition hover:text-[var(--color-primary)]"
              title={project.offeringContractAddress}
            >
              <ExternalLink className="h-3 w-3" />
              {project.offeringContractAddress.slice(0, 6)}…{project.offeringContractAddress.slice(-4)}
            </a>
          ) : (
            <span className="text-xs text-[var(--color-foreground-subtle)]">Sin contrato desplegado</span>
          )}
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary-strong)] transition hover:text-[var(--color-primary)]"
          >
            Ver detalle
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">
        {label}
      </div>
      <div
        className={`mt-2 text-sm font-semibold ${
          accent
            ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent"
            : "font-medium text-[var(--color-foreground)]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
