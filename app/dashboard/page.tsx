"use client";

import Link from "next/link";
import { Wallet, FolderOpen, Landmark, ShieldCheck } from "lucide-react";
import { useSession } from "@/providers/session-provider";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useUsers } from "@/features/admin/hooks/use-users";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";
import { StatPanel } from "@/shared/ui/stat-panel";

export default function DashboardHomePage() {
  const { user, permissions } = useSession();
  const projectsQuery = useProjects();
  const usersQuery = useUsers(permissions.canReadUsers);

  const projectsCount = projectsQuery.data?.content.length ?? 0;
  const usersCount = permissions.canReadUsers ? usersQuery.data?.content.length ?? 0 : null;

  return (
    <>
      <PageHeader
        eyebrow="Mi dashboard"
        title={`Hola, ${user?.email ?? "usuario"}`}
        description="Desde aqui puedes seguir tu cuenta, entrar a proyectos, revisar tu wallet y moverte segun el rol que tengas dentro de LIKEN."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatPanel label="Rol actual" value={user?.role ?? "USER"} hint="La navegacion cambia segun permisos y perfil operativo." />
        <StatPanel label="Proyectos visibles" value={String(projectsCount)} hint="Catalogo actual de oportunidades disponibles." />
        <StatPanel
          label="Usuarios"
          value={usersCount === null ? "Privado" : String(usersCount)}
          hint={usersCount === null ? "Solo visible para perfiles con permisos de lectura." : "Conteo actual de cuentas disponibles en el panel."}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Card title="Resumen personal" description="Primer corte orientado al inversor dentro de la plataforma.">
          <div className="grid gap-3 md:grid-cols-2">
            <QuickTile icon={<Landmark className="h-4 w-4" />} label="Capital invertido" value="0 USD" helper="Se activara cuando el modulo de inversiones cierre su integracion." />
            <QuickTile icon={<Wallet className="h-4 w-4" />} label="Saldo disponible" value="0 USD" helper="Espacio preparado para wallet y pasarela de pagos." />
            <QuickTile icon={<FolderOpen className="h-4 w-4" />} label="Participaciones" value="0 activas" helper="Tus tokens e inversiones apareceran aqui." />
            <QuickTile icon={<ShieldCheck className="h-4 w-4" />} label="Estado de cuenta" value="Lista" helper="Tu acceso y permisos ya estan funcionando contra el backend." />
          </div>
        </Card>

        <Card title="Accesos rapidos" description="Atajos utiles para tu recorrido inicial.">
          <div className="grid gap-3 text-sm">
            <QuickLink href="/dashboard/projects" title="Ir a proyectos" description="Explora oportunidades y crea una si tu rol lo permite." />
            <QuickLink href="/dashboard/investments" title="Ver inversiones" description="Seguimiento de cartera, dividendos y rendimiento." />
            <QuickLink href="/dashboard/wallet" title="Abrir wallet" description="Saldo, tokens LIKEN y conexion blockchain." />
            <QuickLink href="/dashboard/account" title="Gestionar cuenta" description="Perfil, datos personales y cierre de sesion." />
          </div>
        </Card>
      </div>
    </>
  );
}

function QuickTile({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">
        <span className="text-[var(--color-accent)]">{icon}</span>
        {label}
      </div>
      <div className="mt-3 text-lg font-semibold text-[var(--color-foreground)]">{value}</div>
      <div className="mt-2 text-sm leading-6 text-[var(--color-foreground-muted)]">{helper}</div>
    </div>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 transition hover:border-[var(--color-accent)]"
    >
      <div className="font-semibold text-[var(--color-foreground)]">{title}</div>
      <div className="mt-1 leading-6 text-[var(--color-foreground-muted)]">{description}</div>
    </Link>
  );
}
