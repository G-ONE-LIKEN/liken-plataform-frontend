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
  emailVerified?: boolean;
  exp?: number;
  /**
   * Dirección on-chain vinculada al usuario (EIP-55), o null si no se vinculó.
   * Es source-of-truth para mapear eventos on-chain → userId en el backend.
   * Se actualiza vía `POST /api/users/me/wallet` (firma de nonce — ver
   * `useLinkWallet`). El JWT *puede* traerla; si no, viene del `GET /api/users/me`.
   */
  walletAddress?: string | null;
  /** Estado KYC. Lo trae `GET /api/users/me`. Gate de inversión. */
  kycStatus?: "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";
  /** Tier del inversor. Lo trae `GET /api/users/me`. */
  tier?: "BRONZE" | "SILVER" | "GOLD";
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

  /** El usuario tiene una wallet on-chain vinculada (Fase 1 backend). */
  hasLinkedWallet: boolean;
};
