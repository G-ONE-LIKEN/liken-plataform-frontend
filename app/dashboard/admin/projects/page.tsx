"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock, Loader2, Zap, Eye, AlertTriangle } from "lucide-react";
import { AccessGate } from "@/features/auth/components/access-gate";
import { PageHeader } from "@/shared/ui/page-header";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { usePendingApprovalProjects } from "@/features/projects/hooks/use-projects";
import { useApproveProject, useRejectProject } from "@/features/projects/hooks/use-project-mutations";
import type { ProjectSummary } from "@/features/projects/types/projects";

function ProjectRow({ project }: { project: ProjectSummary }) {
  const approve = useApproveProject();
  const reject = useRejectProject();
  const [pending, setPending] = useState<"APPROVE" | "REJECT" | null>(null);
  const [reason, setReason] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);

  async function handleApprove() {
    setPending("APPROVE");
    try {
      await approve.mutateAsync(project.id);
      toast({ title: "Proyecto aprobado", description: project.name });
    } catch (err) {
      toast({
        title: "Error al aprobar",
        description: err instanceof Error ? err.message : "Error inesperado.",
        variant: "destructive",
      });
    } finally {
      setPending(null);
    }
  }

  async function handleReject() {
    setPending("REJECT");
    try {
      await reject.mutateAsync({ id: project.id, reason: reason.trim() || undefined });
      toast({ title: "Proyecto rechazado", description: project.name });
      setRejectOpen(false);
      setReason("");
    } catch (err) {
      toast({
        title: "Error al rechazar",
        description: err instanceof Error ? err.message : "Error inesperado.",
        variant: "destructive",
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <div className="rounded-xl border border-border/50 bg-card px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{project.name}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span>ID #{project.id}</span>
                <span>•</span>
                <span>{project.energyType}</span>
                <span>•</span>
                <span>Owner #{project.ownerId}</span>
                <span>•</span>
                <span>{project.totalTokens} LKN @ {project.tokenPrice}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <Badge tone="warning">Pendiente</Badge>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <Link href={`/dashboard/admin/projects/${project.id}`}>
                  <Eye className="h-3.5 w-3.5" />
                  Revisar
                </Link>
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
                disabled={!!pending}
                onClick={handleApprove}
              >
                {pending === "APPROVE" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                Aprobar
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
                disabled={!!pending}
                onClick={() => setRejectOpen(true)}
              >
                <XCircle className="h-3.5 w-3.5" />
                Rechazar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={(open) => { if (!pending) setRejectOpen(open); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <DialogTitle>Rechazar proyecto</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              Vas a rechazar <span className="font-medium text-foreground">{project.name}</span>. El developer recibirá el motivo que indiques.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label htmlFor={`reason-${project.id}`} className="text-sm font-medium text-foreground">
              Motivo del rechazo <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
            </label>
            <Textarea
              id={`reason-${project.id}`}
              placeholder="Ej: La documentación técnica está incompleta o las proyecciones financieras no son realistas."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              disabled={!!pending}
              onClick={() => setRejectOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
              disabled={!!pending}
              onClick={handleReject}
            >
              {pending === "REJECT" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Confirmar rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PendingProjectsContent() {
  const query = usePendingApprovalProjects();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administración"
        title="Proyectos pendientes de aprobación"
        description="Revisá y aprobá los proyectos creados por los desarrolladores antes de que se publiquen en la plataforma."
      />

      {query.isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (query.data?.content ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 py-12 text-center">
          <Clock className="mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">Sin proyectos pendientes</p>
          <p className="mt-1 text-xs text-muted-foreground">No hay proyectos a la espera de aprobación.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(query.data?.content ?? []).map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <AccessGate allow={(ctx) => ctx.isAdmin}>
      <PendingProjectsContent />
    </AccessGate>
  );
}
