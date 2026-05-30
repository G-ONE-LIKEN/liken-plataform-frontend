"use client";

import type { PermissionContext } from "@/features/auth/types/auth";
import { useSession } from "@/providers/session-provider";
import { Card } from "@/shared/ui/card";

type AccessGateProps = {
  allow: (permissions: PermissionContext) => boolean;
  children: React.ReactNode;
};

export function AccessGate({ allow, children }: AccessGateProps) {
  const { permissions } = useSession();

  if (!allow(permissions)) {
    return (
      <Card
        title="Acceso restringido"
        description="No tenés los permisos necesarios para acceder a esta sección. Contactá a un administrador si creés que es un error."
      />
    );
  }

  return <>{children}</>;
}
