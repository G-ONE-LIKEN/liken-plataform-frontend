import type { PermissionContext } from "@/features/auth/types/auth";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  permission?: keyof Pick<
    PermissionContext,
    | "canReadUsers"
    | "isAdmin"
    | "isSuperAdmin"
    | "canManageRoles"
    | "isDeveloper"
    | "canManageProjects"
  >;
};

export const publicNavigation: NavItem[] = [
  {
    href: "/login",
    label: "Ingresar",
    description: "Entrar al panel para operar, invertir y administrar.",
  },
  {
    href: "/register",
    label: "Registro",
    description: "Crear una cuenta nueva en la plataforma.",
  },
];

export const dashboardNavigation: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Vista general de tu cuenta y actividad.",
  },
  {
    href: "/dashboard/projects",
    label: "Proyectos",
    description: "Explorar proyectos y, segun el rol, crear o administrar.",
  },
  {
    href: "/dashboard/projects/mine",
    label: "Mis proyectos",
    description: "Proyectos creados por mí — incluye los pendientes de aprobacion.",
    permission: "canManageProjects",
  },
  {
    href: "/dashboard/admin/projects",
    label: "Aprobar proyectos",
    description: "Revisar y aprobar proyectos pendientes propuestos por developers.",
    permission: "isAdmin",
  },
  {
    href: "/dashboard/investments",
    label: "Inversiones",
    description: "Seguir cartera, dividendos y rendimiento.",
  },
  {
    href: "/dashboard/wallet",
    label: "Wallet",
    description: "Ver saldo, tokens LIKEN y conexion blockchain.",
  },
  {
    href: "/dashboard/account",
    label: "Mi cuenta",
    description: "Administrar perfil, sesion y configuracion personal.",
  },
  {
    href: "/dashboard/users",
    label: "Usuarios",
    description: "Gestion y revision de cuentas.",
    permission: "canReadUsers",
  },
  {
    href: "/dashboard/admin/developers",
    label: "Desarrolladores",
    description: "Aprobar o rechazar cuentas de desarrolladores.",
    permission: "isAdmin",
  },
];
