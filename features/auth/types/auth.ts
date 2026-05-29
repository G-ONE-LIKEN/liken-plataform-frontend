export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthLoginResponse = string;

export type AuthRegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type SessionUser = {
  id: number;
  email: string;
  role: string;
  permissions: string[];
  exp?: number;
};

export type PermissionContext = {
  isAdmin: boolean;
  isDeveloper: boolean;
  canReadUsers: boolean;
  canManageUsers: boolean;
  canReadProjects: boolean;
  canManageProjects: boolean;
};
