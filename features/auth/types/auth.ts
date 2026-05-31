export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthLoginResponse = { accessToken: string };

export type AuthRegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  phone: string;
  country: string;
  province: string;
  address: string;
  termsAccepted: boolean;
};

export type SessionUser = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  permissions: string[];
  profileCompleted: boolean;
  exp?: number;
};

export type PermissionContext = {
  // Derivados del nombre de rol — solo cuando el backend no expone un permiso granular
  isSuperAdmin: boolean;
  isAdmin: boolean;      // true para ADMIN y SUPER_ADMIN
  isDeveloper: boolean;

  // Usuarios (permisos: user:read, user:update, user:delete)
  canReadUsers: boolean;
  canManageUsers: boolean;

  // KYC (permiso: kyc:review)
  canReviewKyc: boolean;

  // Proyectos (permisos: project:create, project:update, project:delete)
  canReadProjects: boolean;
  canManageProjects: boolean;

  // Roles y Permisos — backend requiere ROLE_ADMIN explícitamente
  canManageRoles: boolean;

  // Inversiones (permiso: investment:create — servicio futuro)
  canInvest: boolean;
};
