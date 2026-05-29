"use client";

import { AccessGate } from "@/features/auth/components/access-gate";
import { UsersTable } from "@/features/admin/components/users-table";
import { PageHeader } from "@/shared/ui/page-header";

export default function DashboardUsersPage() {
  return (
    <AccessGate allow={(permissions) => permissions.canReadUsers}>
      <PageHeader
        eyebrow="Usuarios"
        title="Gestión y revisión de cuentas"
        description="Este panel consume el user-service actual y muestra la base operativa necesaria para soporte, compliance y administración."
      />
      <UsersTable />
    </AccessGate>
  );
}
