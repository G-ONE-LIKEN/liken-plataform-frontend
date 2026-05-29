"use client"

import { User, Mail, Shield, BadgeCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "@/providers/session-provider"

export default function AccountPage() {
  const { user, permissions, logout } = useSession()
  const displayName = user?.email?.split("@")[0] ?? "Usuario"

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
              <div className="mt-4 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{user?.role ?? "USER"}</span>
              </div>
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span className="text-sm text-muted-foreground">Rol</span>
                  <span className="text-sm font-medium text-foreground">{user?.role}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span className="text-sm text-muted-foreground">Admin</span>
                  <span className="text-sm font-medium text-foreground">{permissions.isAdmin ? "Sí" : "No"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tu información de perfil</CardDescription>
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
              <div className="space-y-2">
                <Label>Permisos</Label>
                <div className="flex flex-wrap gap-2">
                  {user?.permissions.map((p) => (
                    <span key={p} className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

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
