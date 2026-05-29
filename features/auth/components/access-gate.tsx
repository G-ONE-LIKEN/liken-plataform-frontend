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
        description="Tu rol actual no tiene permisos suficientes para operar esta sección del panel."
      />
    );
  }

  return <>{children}</>;
}
