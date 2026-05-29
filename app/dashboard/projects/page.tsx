"use client";

import { AccessGate } from "@/features/auth/components/access-gate";
import { ProjectsGrid } from "@/features/projects/components/projects-grid";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useSession } from "@/providers/session-provider";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";

export default function DashboardProjectsPage() {
  const { permissions, token, user, isAuthenticated } = useSession();
  const projectsQuery = useProjects();

  return (
    <AccessGate allow={(context) => context.canReadProjects}>
      <PageHeader
        eyebrow="Proyectos"
        title="Explorar y administrar"
        description="Todos pueden ver oportunidades. Los perfiles con permisos de gestion quedan listos para crear y operar proyectos."
        actions={permissions.canManageProjects ? <Button>Crear proyecto</Button> : undefined}
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <div className="grid gap-4">
          {projectsQuery.isError && (
            <Card title="Diagnostico de acceso" description="Estado real de la sesion y del request a proyectos.">
              <div className="grid gap-3 text-sm text-[var(--color-foreground-muted)]">
                <DebugRow label="Autenticado" value={isAuthenticated ? "Si" : "No"} />
                <DebugRow label="Token guardado" value={token ? "Si" : "No"} />
                <DebugRow label="Usuario parseado" value={user ? `${user.email} | ${user.role}` : "Sin usuario"} />
                <DebugRow label="Error API" value={projectsQuery.error instanceof Error ? projectsQuery.error.message : "Sin detalle"} />
              </div>
            </Card>
          )}

          <ProjectsGrid />
        </div>

        <Card title="Capacidades por rol" description="La experiencia cambia segun permisos.">
          <ul className="grid gap-3 text-sm leading-6 text-[var(--color-foreground-muted)]">
            <li>Usuario inversor: explora proyectos y evalua donde participar.</li>
            <li>Developer o admin: puede crear o administrar proyectos cuando el backend habilite esas acciones.</li>
            <li>Este modulo ya esta pensado para crecer hacia validacion, publicacion y monitoreo.</li>
          </ul>
        </Card>
      </div>
    </AccessGate>
  );
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">{label}</div>
      <div className="mt-2 break-all text-sm font-medium text-[var(--color-foreground)]">{value}</div>
    </div>
  );
}
