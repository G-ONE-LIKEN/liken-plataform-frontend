import { jwtDecode } from "jwt-decode";
import type { PermissionContext, SessionUser } from "@/features/auth/types/auth";

type DecodedToken = {
  id?: number | string;
  sub?: string;
  role?: string;
  permissions?: string[] | string;
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

  return {
    id: normalizedId,
    email: looksLikeEmail ? normalizedSub : `Usuario #${normalizedId || "sin-id"}`,
    role: decoded.role ?? "USER",
    permissions,
    exp: decoded.exp,
  };
}

export function getPermissionContext(user: SessionUser | null): PermissionContext {
  const permissions = new Set(user?.permissions ?? []);
  const normalizedRole = String(user?.role ?? "").toUpperCase();
  const isAdmin = normalizedRole.includes("ADMIN");
  const isDeveloper = normalizedRole.includes("DEVELOPER");

  return {
    isAdmin,
    isDeveloper,
    canReadUsers: isAdmin || permissions.has("user:read"),
    canManageUsers: isAdmin || permissions.has("user:update") || permissions.has("user:delete"),
    canReadProjects: true,
    canManageProjects:
      isAdmin ||
      isDeveloper ||
      permissions.has("project:create") ||
      permissions.has("project:update") ||
      permissions.has("project:delete"),
  };
}
