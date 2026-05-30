"use client";

import { useState } from "react";
import { ShieldCheck, Plus, Loader2, Check, X } from "lucide-react";
import { AccessGate } from "@/features/auth/components/access-gate";
import { PageHeader } from "@/shared/ui/page-header";
import { useRolesDetail, usePermissions, useCreateRole, useAssignPermissions } from "@/features/admin/hooks/use-permissions";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CreateRoleDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const create = useCreateRole();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("El nombre es obligatorio."); return; }
    try {
      await create.mutateAsync({ name: name.toUpperCase().replace(/\s+/g, "_"), description });
      setOpen(false);
      setName("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el rol.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" />Nuevo rol</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Rol</DialogTitle>
          <DialogDescription>Define un nuevo rol con nombre y descripción. Los permisos se asignan después.</DialogDescription>
        </DialogHeader>
        <form id="create-role-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="role-name">Nombre</Label>
            <Input id="role-name" placeholder="ANALYST" value={name} onChange={(e) => setName(e.target.value)} required />
            <p className="text-xs text-muted-foreground">Se guardará en mayúsculas con guiones bajos.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role-desc">Descripción</Label>
            <Input id="role-desc" placeholder="Analista de proyectos" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button form="create-role-form" type="submit" disabled={create.isPending} className="gap-2">
            {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Crear rol
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoleCard({ role }: { role: import("@/features/admin/hooks/use-permissions").RoleDetail }) {
  const permissionsQuery = usePermissions();
  const assign = useAssignPermissions();
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<number[]>(role.permissions.map((p) => p.id));
  const [saving, setSaving] = useState(false);

  const allPermissions = permissionsQuery.data ?? [];

  function togglePermission(id: number) {
    setSelected((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await assign.mutateAsync({ roleId: role.id, permissionIds: selected });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {role.name}
            </CardTitle>
            <CardDescription className="mt-0.5">{role.description || "Sin descripción"}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setEditing(!editing); setSelected(role.permissions.map((p) => p.id)); }}
          >
            {editing ? "Cancelar" : "Editar permisos"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!editing ? (
          <div className="flex flex-wrap gap-2">
            {role.permissions.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sin permisos asignados</p>
            ) : (
              role.permissions.map((p) => (
                <Badge key={p.id} tone="brand">{p.name}</Badge>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {permissionsQuery.isLoading ? (
              <Skeleton className="h-20" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {allPermissions.map((p) => {
                  const active = selected.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePermission(p.id)}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 opacity-40" />}
                      {p.name}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                Guardar
              </Button>
              <p className="text-xs text-muted-foreground">{selected.length} permiso{selected.length !== 1 ? "s" : ""} seleccionado{selected.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RolesContent() {
  const rolesQuery = useRolesDetail();

  return (
    <div className="space-y-8">
        <PageHeader
          eyebrow="Administración"
          title="Roles y Permisos"
          description="Gestioná los roles del sistema y los permisos asignados a cada uno."
          actions={<CreateRoleDialog />}
        />

        {rolesQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        ) : rolesQuery.isError ? (
          <p className="text-sm text-destructive">Error al cargar roles.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {(rolesQuery.data ?? []).map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        )}
    </div>
  );
}

export default function RolesPage() {
  return (
    <AccessGate allow={(ctx) => ctx.canManageRoles}>
      <RolesContent />
    </AccessGate>
  );
}
