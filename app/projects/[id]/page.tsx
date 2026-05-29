"use client";

import Link from "next/link";
import { ArrowLeft, Factory, MapPin, Wallet } from "lucide-react";
import { useParams } from "next/navigation";
import { useProjectDetail } from "@/features/projects/hooks/use-projects";
import { Badge } from "@/shared/ui/badge";
import { buttonStyles } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { PageHeader } from "@/shared/ui/page-header";
import { formatCurrency, formatDate, formatPercent } from "@/shared/lib/utils";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);
  const { data, isLoading, isError, error } = useProjectDetail(projectId);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Card className="h-64 animate-pulse" />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <EmptyState
          title="No pudimos cargar el detalle"
          description={error instanceof Error ? error.message : "Revisa disponibilidad del servicio de proyectos."}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/projects" className={buttonStyles("ghost")}>
          <ArrowLeft className="h-4 w-4" />
          Volver al catalogo
        </Link>
        <Link href="/dashboard/web3" className={buttonStyles("secondary")}>
          <Wallet className="h-4 w-4" />
          Preparar wallet
        </Link>
      </div>

      <PageHeader
        eyebrow="Proyecto"
        title={data.name}
        description={data.description}
        actions={<Badge tone={data.state === "OPEN" ? "success" : "brand"}>{data.state}</Badge>}
      />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4">
          <Card title="Resumen operativo" description="Lectura rapida del proyecto antes de pasar a decisiones o integraciones.">
            <div className="grid gap-3 md:grid-cols-2">
              <Metric label="Energia" value={data.energyType} />
              <Metric label="Ubicacion" value={`${data.province}, ${data.country}`} />
              <Metric label="Capacidad instalada" value={`${data.installedCapacityMW} MW`} />
              <Metric label="Token price" value={formatCurrency(data.tokenPrice)} />
              <Metric label="Inversion minima" value={formatCurrency(data.minimumInvestment)} />
              <Metric label="Yield esperado" value={formatPercent(data.expectedAnnualYield)} />
              <Metric label="Fecha inicio" value={formatDate(data.startDate)} />
              <Metric label="Fecha cierre" value={formatDate(data.endDate)} />
            </div>
          </Card>

          <Card title="Lectura funcional" description="Donde este proyecto se apoya hoy y hacia donde deberia crecer la experiencia.">
            <div className="grid gap-3 text-sm leading-6 text-[var(--color-foreground-muted)]">
              <p>
                Esta ficha ya sirve para consulta real. El siguiente salto de valor no es estetico sino
                operativo: filtros, acciones administrables y activacion de inversion cuando el contrato final
                y las validaciones de negocio esten listas.
              </p>
              <p>
                El detalle ya esta desacoplado de la capa blockchain. Eso permite que la app siga siendo usable
                incluso cuando wallet o contratos todavia no son obligatorios para todos los usuarios.
              </p>
            </div>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card title="Contexto" description="Atajos visuales para leer el tipo de activo.">
            <div className="grid gap-3">
              <InfoPill icon={<Factory className="h-4 w-4" />} label="Perfil" value="Infraestructura renovable tokenizable" />
              <InfoPill icon={<MapPin className="h-4 w-4" />} label="Localizacion" value={`${data.province}, ${data.country}`} />
              <InfoPill icon={<Wallet className="h-4 w-4" />} label="Estado Web3" value="Listo para integrarse desde dashboard/web3" />
            </div>
          </Card>

          <Card title="Proximos pasos" description="Buen lugar para crecer sin volver a reestructurar el front.">
            <ul className="grid gap-3 text-sm leading-6 text-[var(--color-foreground-muted)]">
              <li>Mostrar documentos y trazabilidad cuando project-service exponga ese contenido al frontend.</li>
              <li>Agregar call to action de invertir solo para usuarios listos y wallet conectada.</li>
              <li>Unificar eventos de marketplace y dividendos cuando esos microservicios existan de verdad.</li>
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-[var(--color-foreground)]">{value}</dd>
    </div>
  );
}

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">
        <span className="text-[var(--color-primary-strong)]">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-[var(--color-foreground)]">{value}</div>
    </div>
  );
}
