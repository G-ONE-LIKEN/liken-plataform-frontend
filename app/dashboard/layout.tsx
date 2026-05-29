"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { dashboardNavigation } from "@/shared/config/navigation";
import { SidebarNav } from "@/shared/ui/sidebar-nav";
import { Badge } from "@/shared/ui/badge";
import { Button, buttonStyles } from "@/shared/ui/button";
import { useSession } from "@/providers/session-provider";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, permissions, logout } = useSession();

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-7xl gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm">
          <div className="space-y-4">
            <Link href="/" className="inline-flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                LIKEN
              </span>
              <span className="mt-2 text-sm leading-6 text-[var(--color-foreground-muted)]">
                Inversion renovable con trazabilidad, mercado secundario y wallet integrada.
              </span>
            </Link>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">
                Sesion activa
              </div>
              <div className="mt-2 truncate text-sm font-semibold text-[var(--color-foreground)]">{user?.email}</div>
              <div className="mt-3 flex items-center gap-2">
                <Badge tone={permissions.isAdmin ? "danger" : permissions.isDeveloper ? "brand" : "neutral"}>
                  {user?.role ?? "USER"}
                </Badge>
              </div>
            </div>

            <SidebarNav items={dashboardNavigation} permissions={permissions} />
          </div>
        </aside>

        <div className="grid gap-4">
          <header className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">
                  Panel LIKEN
                </div>
                <div className="mt-2 text-lg font-semibold text-[var(--color-foreground)]">
                  Un espacio claro para operar, invertir y administrar segun tu rol
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/projects" className={buttonStyles("secondary")}>
                  Catalogo publico
                </Link>
                <Button variant="ghost" onClick={logout}>
                  Salir de LIKEN
                </Button>
              </div>
            </div>
          </header>

          <main className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
