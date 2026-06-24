"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Zap,
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Store,
  Wallet,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Users,
  ShieldCheck,
  Building2,
  TrendingUp,
  Megaphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProtectedRoute } from "@/features/auth/components/protected-route"
import { useSession } from "@/providers/session-provider"
import { NotificationsDropdown } from "@/features/notifications/components/notifications-dropdown"
import type { PermissionContext } from "@/features/auth/types/auth"
import { KycBanner } from "@/features/kyc/components/kyc-banner"

const navigation: {
  name: string
  href: string
  icon: React.ElementType
  allow?: (p: PermissionContext) => boolean
}[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  // Las siguientes son funciones de "usuario inversor / developer", no de admin.
  // Un admin puro no las necesita en su sidebar.
  { name: "Inversiones", href: "/dashboard/investments", icon: Briefcase, allow: (p) => !p.isAdmin },
  { name: "Proyectos", href: "/dashboard/projects", icon: FolderKanban, allow: (p) => !p.isAdmin },
  { name: "Mis proyectos", href: "/dashboard/projects/mine", icon: FolderKanban, allow: (p) => !p.isAdmin && p.canManageProjects },
  { name: "Marketplace", href: "/dashboard/marketplace", icon: Store, allow: (p) => !p.isAdmin },
  { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
]

const secondaryNavigation = [
  { name: "Mi Cuenta", href: "/dashboard/account", icon: User },
  { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
]

// Cada ítem declara qué permiso necesita — no se usa isAdmin directamente
const adminNavigation: {
  name: string
  href: string
  icon: React.ElementType
  allow: (p: PermissionContext) => boolean
}[] = [
  { name: "Usuarios", href: "/dashboard/users", icon: Users, allow: (p) => p.canReadUsers },
  { name: "Roles y Permisos", href: "/dashboard/admin/roles", icon: ShieldCheck, allow: (p) => p.canManageRoles },
  { name: "Desarrolladores", href: "/dashboard/admin/developers", icon: Building2, allow: (p) => p.isAdmin },
  { name: "Proyectos", href: "/dashboard/admin/projects", icon: FolderKanban, allow: (p) => p.isAdmin },
  { name: "Informe financiero",   href: "/dashboard/admin/reports",  icon: TrendingUp,   allow: (p) => p.isAdmin },
  { name: "Notificaciones",        href: "/dashboard/admin/broadcast", icon: Megaphone,   allow: (p) => p.isAdmin },
]

/**
 * Rutas que el admin NO debe poder visitar — incluso tipeando la URL.
 * Son las páginas pensadas para usuarios inversores/developers.
 * Si el admin entra acá lo redirigimos a /dashboard.
 *
 * El matching es por prefijo: "/dashboard/wallet" bloquea también "/dashboard/wallet/x/y".
 */
const ADMIN_BLOCKED_PREFIXES = [
  "/dashboard/investments",
  "/dashboard/projects",     // catálogo + /mine
  "/dashboard/marketplace",
]

/**
 * Rutas que los NO-admin no deben poder visitar — incluso tipeando la URL.
 * Son las páginas administrativas. Si un inversor/developer entra acá, lo
 * redirigimos a /dashboard.
 */
const NON_ADMIN_BLOCKED_PREFIXES = [
  "/dashboard/users",
  "/dashboard/admin",
]

function matchesAnyPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, permissions, logout } = useSession()

  const displayName = user?.email?.split("@")[0] ?? "Usuario"

  // Bloqueo de rutas por rol:
  //   - admin entrando a rutas de inversor (wallet, investments, etc) → /dashboard
  //   - no-admin entrando a rutas de admin (users, /admin/*) → /dashboard
  // Cualquiera de los dos casos: redirigimos al panel principal.
  const shouldRedirect =
    (permissions.isAdmin && matchesAnyPrefix(pathname, ADMIN_BLOCKED_PREFIXES)) ||
    (!permissions.isAdmin && matchesAnyPrefix(pathname, NON_ADMIN_BLOCKED_PREFIXES))

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/dashboard")
    }
  }, [shouldRedirect, router])

  // Mientras redirige, no renderizamos contenido para evitar parpadeo
  if (shouldRedirect) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-full border border-border bg-card px-5 py-3 text-sm text-muted-foreground">
          Redirigiendo...
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="relative flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />
          <Link href="/dashboard" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_22px_-4px_oklch(0.72_0.16_165/0.8)] transition-shadow group-hover:shadow-[0_0_28px_-2px_oklch(0.72_0.16_165/0.95)]">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-[0.14em] uppercase text-sidebar-foreground">LIKEN</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Principal
          </p>
          {navigation.filter((item) => !item.allow || item.allow(permissions)).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_0_20px_-6px_oklch(0.72_0.16_165/0.9)]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}

          {(() => {
            const visible = adminNavigation.filter((item) => item.allow(permissions))
            if (visible.length === 0) return null
            return (
              <>
                <div className="my-4 border-t border-sidebar-border" />
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Administración
                </p>
                {visible.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                        ${isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </>
            )
          })()}

          <div className="my-4 border-t border-sidebar-border" />

          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Configuración
          </p>
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_0_20px_-6px_oklch(0.72_0.16_165/0.9)]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-accent ring-1 ring-primary/20">
              <User className="h-5 w-5 text-sidebar-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{displayName}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-muted-foreground">{user?.role ?? "USER"}</p>
                {permissions.isAdmin && (
                  <span className="rounded-full border border-primary/30 bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground lg:hidden">
            <Menu className="h-6 w-6" />
          </button>

          <div className="relative hidden flex-1 md:block md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar proyectos, tokens..." className="pl-10" />
          </div>

          <div className="ml-auto flex items-center gap-4">
            <NotificationsDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary lg:flex">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-[0_0_18px_-5px_oklch(0.72_0.16_165/0.8)]">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{displayName}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-xs text-muted-foreground">Conectado como</p>
                  <p className="truncate text-sm font-medium">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/account">
                    <User className="mr-2 h-4 w-4" />
                    Mi Cuenta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/configuracion">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Suspense fallback={null}>
            <KycBanner />
          </Suspense>
          {children}
        </main>

      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  )
}
