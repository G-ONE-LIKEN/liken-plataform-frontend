"use client"

import { useState } from "react"
import { User, Mail, Shield, BadgeCheck, LogOut, KeyRound, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "@/providers/session-provider"
import { useChangePassword } from "@/features/auth/hooks/use-change-password"

const KYC_CONFIG: Record<string, { label: string; className: string }> = {
  NOT_STARTED: { label: "Sin iniciar", className: "bg-secondary text-muted-foreground" },
  PENDING: { label: "En revisión", className: "bg-accent/20 text-accent-foreground" },
  APPROVED: { label: "Verificado", className: "bg-green-500/10 text-green-500" },
  REJECTED: { label: "Rechazado", className: "bg-destructive/10 text-destructive" },
}

const TIER_CONFIG: Record<string, { label: string; className: string }> = {
  BASIC: { label: "Básico", className: "bg-secondary text-muted-foreground" },
  SILVER: { label: "Silver", className: "bg-slate-400/20 text-slate-400" },
  GOLD: { label: "Gold", className: "bg-yellow-500/10 text-yellow-500" },
}

export default function AccountPage() {
  const { user, permissions, logout } = useSession()
  const changePassword = useChangePassword()
  const displayName = user?.email?.split("@")[0] ?? "Usuario"

  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmNew: "" })
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError(null)
    setPwSuccess(false)

    if (pwForm.newPassword.length < 6) {
      setPwError("La nueva contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (pwForm.newPassword !== pwForm.confirmNew) {
      setPwError("Las contraseñas no coinciden.")
      return
    }

    try {
      await changePassword.mutateAsync({
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      })
      setPwSuccess(true)
      setPwForm({ oldPassword: "", newPassword: "", confirmNew: "" })
      setTimeout(() => setPwSuccess(false), 5000)
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mi Cuenta</h1>
        <p className="mt-1 text-muted-foreground">Gestiona tu perfil y configuración de sesión</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary">
                <User className="h-12 w-12 text-primary-foreground" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-3 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{user?.role ?? "USER"}</span>
              </div>

              <div className="mt-6 w-full space-y-2 text-left">
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                  <span className="text-sm text-muted-foreground">Rol</span>
                  <span className="text-sm font-medium text-foreground">{user?.role ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                  <span className="text-sm text-muted-foreground">Admin</span>
                  <span className="text-sm font-medium text-foreground">{permissions.isAdmin ? "Sí" : "No"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Información personal */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Tu email y permisos activos en esta cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" defaultValue={user?.email ?? ""} className="pl-10" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Input id="role" defaultValue={user?.role ?? ""} readOnly />
              </div>
              {user?.permissions && user.permissions.length > 0 && (
                <div className="space-y-2">
                  <Label>Permisos activos</Label>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.map((p) => (
                      <span key={p} className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cambiar contraseña */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Cambiar Contraseña
              </CardTitle>
              <CardDescription>Actualizá tu contraseña de acceso</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleChangePassword}>
                <div className="space-y-2">
                  <Label htmlFor="old-password">Contraseña actual</Label>
                  <Input
                    id="old-password"
                    type="password"
                    placeholder="••••••••"
                    value={pwForm.oldPassword}
                    onChange={(e) => setPwForm((f) => ({ ...f, oldPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva contraseña</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nueva</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Repetí la contraseña"
                      value={pwForm.confirmNew}
                      onChange={(e) => setPwForm((f) => ({ ...f, confirmNew: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {pwError && (
                  <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {pwError}
                  </p>
                )}
                {pwSuccess && (
                  <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    Contraseña actualizada correctamente.
                  </div>
                )}

                <Button type="submit" disabled={changePassword.isPending} className="gap-2">
                  {changePassword.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Actualizar contraseña
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sesión */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Sesión
              </CardTitle>
              <CardDescription>Gestiona tu sesión activa en este dispositivo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg bg-green-500/10 p-4">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-foreground">Sesión activa</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-500">Activa</span>
              </div>
              <Button
                variant="outline"
                className="mt-4 gap-2 border-destructive text-destructive hover:bg-destructive/10"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
