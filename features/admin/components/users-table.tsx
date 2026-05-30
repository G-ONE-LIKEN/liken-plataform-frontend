"use client";

import { useState } from "react";
import { Search, MoreHorizontal, UserCheck, UserX, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUsers } from "@/features/admin/hooks/use-users";
import { useRoles } from "@/features/admin/hooks/use-roles";
import { useActivateUser, useDeactivateUser, useChangeUserRole } from "@/features/admin/hooks/use-user-actions";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { Table } from "@/shared/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function kycBadge(status: string | undefined) {
  const s = status ?? "NOT_STARTED";
  const map: Record<string, { tone: "success" | "warning" | "danger" | "neutral"; label: string }> = {
    APPROVED: { tone: "success", label: "Verificado" },
    PENDING: { tone: "warning", label: "Pendiente" },
    REJECTED: { tone: "danger", label: "Rechazado" },
    NOT_STARTED: { tone: "neutral", label: "Sin iniciar" },
    NONE: { tone: "neutral", label: "Sin iniciar" },
  };
  const config = map[s] ?? { tone: "neutral" as const, label: s };
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

export function UsersTable() {
  const { data, isLoading, isError, error } = useUsers();
  const rolesQuery = useRoles();
  const activate = useActivateUser();
  const deactivate = useDeactivateUser();
  const changeRole = useChangeUserRole();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  if (isLoading) {
    return <Card className="h-72 animate-pulse" />;
  }

  if (isError) {
    return (
      <EmptyState
        title="No pudimos cargar usuarios"
        description={error instanceof Error ? error.message : "Revisá permisos o disponibilidad del gateway."}
      />
    );
  }

  if (!data?.content.length) {
    return (
      <EmptyState
        title="No hay usuarios para listar"
        description="Cuando existan cuentas registradas, este panel mostrará sus datos principales y estado operativo."
      />
    );
  }

  const roles = Array.from(new Set(data.content.map((u) => u.role?.name).filter(Boolean))) as string[];
  const availableRoles = rolesQuery.data ?? [];

  const filtered = data.content.filter((u) => {
    const matchesSearch = search === "" || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "" || u.role?.name === roleFilter;
    return matchesSearch && matchesRole;
  });

  async function handleToggleActive(userId: number, isActive: boolean) {
    setPendingUserId(userId);
    try {
      if (isActive) {
        await deactivate.mutateAsync(userId);
        toast({ title: "Usuario desactivado", description: "El acceso fue revocado correctamente." });
      } else {
        await activate.mutateAsync(userId);
        toast({ title: "Usuario activado", description: "El usuario puede ingresar nuevamente." });
      }
    } catch (err) {
      toast({
        title: "No se pudo actualizar el usuario",
        description: err instanceof Error ? err.message : "Error inesperado.",
        variant: "destructive",
      });
    } finally {
      setPendingUserId(null);
    }
  }

  async function handleChangeRole(userId: number, roleId: number) {
    setPendingUserId(userId);
    try {
      await changeRole.mutateAsync({ userId, roleId });
      toast({ title: "Rol actualizado", description: "El cambio se aplicó correctamente." });
    } catch (err) {
      toast({
        title: "No se pudo cambiar el rol",
        description: err instanceof Error ? err.message : "Error inesperado.",
        variant: "destructive",
      });
    } finally {
      setPendingUserId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-foreground-subtle)]" />
          <input
            type="search"
            placeholder="Buscar por email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] pl-9 pr-4 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-foreground-subtle)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
          />
        </div>
        {roles.length > 0 && (
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-accent)]"
          >
            <option value="">Todos los roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Sin resultados" description="Ningún usuario coincide con los filtros aplicados." />
      ) : (
        <Table
          columns={[
            {
              key: "email",
              title: "Cuenta",
              render: (user) => (
                <div>
                  <div className="font-semibold">{user.email}</div>
                  <div className="text-xs text-[var(--color-foreground-subtle)]">ID #{user.id}</div>
                </div>
              ),
            },
            {
              key: "role",
              title: "Rol",
              render: (user) => user.role?.name ?? "Sin rol",
            },
            {
              key: "tier",
              title: "Tier",
              render: (user) => user.tier ?? "BASIC",
            },
            {
              key: "kyc",
              title: "KYC",
              render: (user) => kycBadge(user.kycStatus),
            },
            {
              key: "status",
              title: "Estado",
              render: (user) => (
                <Badge tone={user.active ? "success" : "danger"}>
                  {user.active ? "Activo" : "Inactivo"}
                </Badge>
              ),
            },
            {
              key: "actions",
              title: "",
              render: (user) => {
                const isPending = pendingUserId === user.id;
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isPending} className="h-8 w-8">
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(user.id, user.active)}
                        className={user.active ? "text-destructive focus:text-destructive" : "text-green-500 focus:text-green-500"}
                      >
                        {user.active ? (
                          <><UserX className="mr-2 h-4 w-4" /> Desactivar</>
                        ) : (
                          <><UserCheck className="mr-2 h-4 w-4" /> Activar</>
                        )}
                      </DropdownMenuItem>

                      {availableRoles.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Cambiar rol
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {availableRoles.map((role) => (
                                <DropdownMenuItem
                                  key={role.id}
                                  onClick={() => handleChangeRole(user.id, role.id)}
                                  className={user.role?.name === role.name ? "font-semibold text-primary" : ""}
                                >
                                  {role.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              },
            },
          ]}
          data={filtered}
        />
      )}
    </div>
  );
}
