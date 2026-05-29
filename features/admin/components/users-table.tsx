"use client";

import { useUsers } from "@/features/admin/hooks/use-users";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { Table } from "@/shared/ui/table";

export function UsersTable() {
  const { data, isLoading, isError, error } = useUsers();

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

  return (
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
          render: (user) => user.kycStatus ?? "NOT_STARTED",
        },
        {
          key: "status",
          title: "Estado",
          render: (user) => <Badge tone={user.active ? "success" : "danger"}>{user.active ? "Activo" : "Inactivo"}</Badge>,
        },
      ]}
      data={data.content}
    />
  );
}
