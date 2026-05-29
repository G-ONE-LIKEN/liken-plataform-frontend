"use client";

import { useSession } from "@/providers/session-provider";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/shared/ui/button";

export default function DashboardAccountPage() {
  const { user, logout } = useSession();

  return (
    <>
      <PageHeader
        eyebrow="Mi cuenta"
        title="Perfil y configuracion"
        description="Administra tus datos principales, revisa tu rol actual y cierra sesion cuando lo necesites."
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card title="Datos personales" description="Primer corte de gestion de cuenta sobre la sesion actual.">
          <div className="grid gap-3">
            <InfoRow label="Email" value={user?.email ?? "Sin email"} />
            <InfoRow label="Rol" value={user?.role ?? "Sin rol"} />
            <InfoRow label="Permisos" value={user?.permissions.join(", ") || "Sin permisos"} />
          </div>
        </Card>

        <Card title="Acciones de cuenta" description="Espacio pensado para nombre, contrasena y preferencias.">
          <div className="grid gap-3 text-sm leading-6 text-[var(--color-foreground-muted)]">
            <p>La estructura ya esta preparada para sumar edicion de nombre, cambio de contrasena y preferencias personales.</p>
            <p>Por ahora, la accion operativa real disponible es cerrar sesion de forma segura desde este dispositivo.</p>
          </div>
          <div className="mt-4">
            <Button variant="danger" onClick={logout}>
              Salir de LIKEN
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">{label}</div>
      <div className="mt-2 break-all text-sm font-medium text-[var(--color-foreground)]">{value}</div>
    </div>
  );
}
