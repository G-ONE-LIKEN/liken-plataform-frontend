"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Building2, Loader2 } from "lucide-react";
import { AccessGate } from "@/features/auth/components/access-gate";
import { PageHeader } from "@/shared/ui/page-header";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useDevelopers, useUpdateDeveloperStatus } from "@/features/admin/hooks/use-developers";
import type { DeveloperStatus } from "@/features/admin/hooks/use-developers";

const STATUS_CONFIG: Record<DeveloperStatus, { label: string; tone: "warning" | "success" | "danger" }> = {
  PENDING:  { label: "Pendiente",  tone: "warning" },
  APPROVED: { label: "Aprobado",   tone: "success" },
  REJECTED: { label: "Rechazado",  tone: "danger"  },
};

function DeveloperRow({ user, showActions }: { user: any; showActions: boolean }) {
  const update = useUpdateDeveloperStatus();
  const [pending, setPending] = useState<DeveloperStatus | null>(null);
  const status: DeveloperStatus = user.developerStatus ?? "PENDING";
  const cfg = STATUS_CONFIG[status];

  async function handle(newStatus: DeveloperStatus) {
    setPending(newStatus);
    try {
      await update.mutateAsync({ userId: user.id, status: newStatus });
      toast({
        title: newStatus === "APPROVED" ? "Desarrollador aprobado" : "Desarrollador rechazado",
        description: user.email,
      });
    } catch (err) {
      toast({
        title: "Error al actualizar",
        description: err instanceof Error ? err.message : "Error inesperado.",
        variant: "destructive",
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-card px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">ID #{user.id}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge tone={cfg.tone}>{cfg.label}</Badge>

        {showActions && (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
              disabled={!!pending}
              onClick={() => handle("APPROVED")}
            >
              {pending === "APPROVED" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              Aprobar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-destructive/50 text-destructive hover:bg-destructive/10"
              disabled={!!pending}
              onClick={() => handle("REJECTED")}
            >
              {pending === "REJECTED" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
              Rechazar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function DeveloperList({ status, showActions }: { status?: DeveloperStatus; showActions: boolean }) {
  const query = useDevelopers(status);

  if (query.isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
      </div>
    );
  }

  const items = query.data?.content ?? [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 py-12 text-center">
        <Clock className="mb-3 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">Sin desarrolladores</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {status === "PENDING" ? "No hay solicitudes pendientes." : "No hay registros en este estado."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((user: any) => (
        <DeveloperRow key={user.id} user={user} showActions={showActions} />
      ))}
    </div>
  );
}

function DevelopersContent() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administración"
        title="Verificación de Desarrolladores"
        description="Revisá y aprobá las cuentas de desarrolladores antes de que puedan publicar proyectos en la plataforma."
      />

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" /> Pendientes
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle2 className="h-4 w-4" /> Aprobados
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="h-4 w-4" /> Rechazados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <DeveloperList status="PENDING" showActions={true} />
        </TabsContent>
        <TabsContent value="approved" className="mt-6">
          <DeveloperList status="APPROVED" showActions={false} />
        </TabsContent>
        <TabsContent value="rejected" className="mt-6">
          <DeveloperList status="REJECTED" showActions={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DevelopersPage() {
  return (
    <AccessGate allow={(ctx) => ctx.isAdmin}>
      <DevelopersContent />
    </AccessGate>
  );
}
