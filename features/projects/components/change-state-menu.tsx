"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Loader2, ArrowRight, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useChangeProjectState } from "@/features/projects/hooks/use-project-mutations";
import { toast } from "@/hooks/use-toast";
import type { OnChainStatus, ProjectState } from "@/features/projects/types/projects";

const STATE_LABEL: Record<ProjectState, string> = {
  PENDING_APPROVAL: "Pendiente de aprobacion",
  DRAFT: "Borrador",
  PRE_OPEN: "Publicar proyecto",
  OPEN: "Parque operativo",
  CLOSED: "Dar de baja",
  CANCELLED: "Cancelar",
};

function allowedTransitions(
  current: ProjectState,
  isAdmin: boolean
): ProjectState[] {
  if (current === "CLOSED" || current === "CANCELLED") return [];
  if (current === "PRE_OPEN") return [];

  const next: ProjectState[] = [];
  if (current === "PENDING_APPROVAL") next.push("DRAFT");
  if (current === "DRAFT") next.push("PRE_OPEN");
  if (current === "OPEN") next.push("CLOSED");

  if (current === "OPEN") {
    if (isAdmin) next.push("CANCELLED");
  } else {
    next.push("CANCELLED");
  }

  return next;
}

export type ChangeStateMenuProps = {
  projectId: number;
  currentState: ProjectState;
  isAdmin: boolean;
  isOwner: boolean;
  onChainStatus?: OnChainStatus;
  size?: "default" | "sm";
};

export function ChangeStateMenu({
  projectId,
  currentState,
  isAdmin,
  isOwner,
  onChainStatus,
  size = "default",
}: ChangeStateMenuProps) {
  const changeState = useChangeProjectState();
  const [confirming, setConfirming] = useState<ProjectState | null>(null);

  const transitions = useMemo(
    () => allowedTransitions(currentState, isAdmin),
    [currentState, isAdmin]
  );
  const publishInProgress =
    currentState === "DRAFT" && onChainStatus === "DEPLOYING";

  if (!isOwner && !isAdmin) return null;
  if (transitions.length === 0) return null;

  function requiresConfirmation(target: ProjectState) {
    return target === "CANCELLED" || target === "CLOSED" || target === "PRE_OPEN";
  }

  async function performChange(target: ProjectState) {
    try {
      await changeState.mutateAsync({ id: projectId, state: target });
      toast({
        title: target === "PRE_OPEN" ? "Publicacion iniciada" : "Estado actualizado",
        description:
          target === "PRE_OPEN"
            ? "El deploy on-chain ya esta en curso. Cuando termine, el proyecto se publicara automaticamente."
            : `El proyecto paso a ${STATE_LABEL[target]}.`,
      });
    } catch (err) {
      toast({
        title: "No se pudo cambiar el estado",
        description: err instanceof Error ? err.message : "Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setConfirming(null);
    }
  }

  async function handleSelect(target: ProjectState) {
    if (requiresConfirmation(target)) {
      setConfirming(target);
    } else {
      await performChange(target);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            disabled={changeState.isPending || publishInProgress}
            className="gap-2"
          >
            {changeState.isPending || publishInProgress ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {publishInProgress ? "Publicando on-chain..." : "Cambiar estado"}
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[220px]">
          <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Estado actual: {STATE_LABEL[currentState]}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {transitions
            .filter((t) => t !== "CANCELLED")
            .map((target) => (
              <DropdownMenuItem key={target} onSelect={() => handleSelect(target)}>
                <ArrowRight className="mr-2 h-3.5 w-3.5 text-primary" />
                {STATE_LABEL[target]}
              </DropdownMenuItem>
            ))}
          {transitions.includes("CANCELLED") && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => handleSelect("CANCELLED")}
                className="text-destructive focus:text-destructive"
              >
                <XCircle className="mr-2 h-3.5 w-3.5" />
                Cancelar proyecto
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirming === "CANCELLED"
                ? "Cancelar proyecto"
                : confirming === "CLOSED"
                ? "Cerrar proyecto"
                : confirming === "PRE_OPEN"
                ? "Publicar proyecto"
                : "Confirmar cambio de estado"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirming === "PRE_OPEN" && (
                <>
                  Vamos a iniciar el deploy on-chain del proyecto. Mientras se procesa,
                  quedara en borrador con estado <strong>DEPLOYING</strong> y se hara
                  publico para inversores solo cuando el OfferingContract quede listo.
                </>
              )}
              {confirming === "CANCELLED" && currentState === "OPEN" && (
                <>
                  Hay inversores con tokens del proyecto. Esta accion dispara el flujo de
                  reembolso/penalizacion y es <strong>irreversible</strong>.
                </>
              )}
              {confirming === "CANCELLED" && currentState !== "OPEN" && (
                <>
                  Esta accion es <strong>irreversible</strong>. El proyecto no podra volver a
                  activarse.
                </>
              )}
              {confirming === "CLOSED" && (
                <>
                  Vas a dar de baja el proyecto. Estado final: el parque deja de aceptar
                  inversiones y los dividendos quedan congelados. Esta accion es irreversible.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirming && performChange(confirming)}
              className={
                confirming === "CANCELLED"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {confirming && STATE_LABEL[confirming]}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
