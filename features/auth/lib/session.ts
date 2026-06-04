import { jwtDecode } from "jwt-decode";
import type { PermissionContext, SessionUser } from "@/features/auth/types/auth";

type DecodedToken = {
  id?: number | string;
  sub?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[] | string;
  profileCompleted?: boolean;
  emailVerified?: boolean;
  exp?: number;
};

export function parseSessionToken(token: string): SessionUser {
  const decoded = jwtDecode<DecodedToken>(token);
  const permissions = Array.isArray(decoded.permissions)
    ? decoded.permissions
    : String(decoded.permissions ?? "")
        .split(",")
        .map((permission) => permission.trim())
        .filter(Boolean);

  const idSource = decoded.id ?? decoded.sub ?? 0;
  const parsedId = Number(idSource);
  const normalizedId = Number.isFinite(parsedId) ? parsedId : 0;
  const normalizedSub = String(decoded.sub ?? "");
  const looksLikeEmail = normalizedSub.includes("@");

  // Prioridad: claim "email" explícito → sub si parece email → fallback
  const email = decoded.email ?? (looksLikeEmail ? normalizedSub : `Usuario #${normalizedId || "sin-id"}`);

  return {
    id: normalizedId,
    email,
    firstName: decoded.firstName,
    lastName: decoded.lastName,
    role: decoded.role ?? "USER",
    permissions,
    profileCompleted: decoded.profileCompleted ?? false,
    emailVerified: decoded.emailVerified,
    exp: decoded.exp,
  };
}

export function getPermissionContext(user: SessionUser | null): PermissionContext {
  const perms = new Set(user?.permissions ?? []);
  const role = String(user?.role ?? "").toUpperCase();
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = isSuperAdmin || role === "ADMIN";
  const isDeveloper = role === "DEVELOPER" || perms.has("project:create");

  return {
    isSuperAdmin,
    isAdmin,
    isDeveloper,

    // user:read permite listar/ver usuarios
    canReadUsers: isAdmin || perms.has("user:read"),

    // user:update | user:delete permiten gestionar usuarios
    canManageUsers: isAdmin || perms.has("user:update") || perms.has("user:delete"),

    // kyc:review permite aprobar/rechazar documentos KYC
    canReviewKyc: isAdmin || perms.has("kyc:review"),

    // proyectos son públicos para lectura
    canReadProjects: true,

    // project:create | project:update | project:delete
    canManageProjects:
      isAdmin ||
      isDeveloper ||
      perms.has("project:create") ||
      perms.has("project:update") ||
      perms.has("project:delete"),

    // backend usa @PreAuthorize("hasRole('ROLE_ADMIN')") en roles CRUD
    canManageRoles: isAdmin,

    // investment:create (servicio futuro)
    canInvest: isAdmin || perms.has("investment:create"),
  };
}
