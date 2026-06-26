"use client";

import { env } from "@/shared/config/env";
import type { ApiResponse } from "@/shared/types/api";

export class ApiClientError extends Error {
  code?: string | null;
  status: number;

  constructor(message: string, status = 500, code?: string | null) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

export class UnauthorizedError extends ApiClientError {
  constructor(message = "No autorizado", code?: string | null) {
    super(message, 401, code);
    this.name = "UnauthorizedError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

let memoryToken: string | null = null;

export function getStoredToken(): string | null {
  return memoryToken;
}

export function setStoredToken(token: string | null) {
  memoryToken = token;
}

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

export async function attemptRefresh(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;
  try {
    const res = await fetch(`${env.apiUrl}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      refreshQueue.forEach((cb) => cb(null));
      refreshQueue = [];
      return null;
    }

    const body = await res.json();
    const newToken: string | null = body?.data?.accessToken ?? null;

    if (newToken) {
      setStoredToken(newToken);
      window.dispatchEvent(new Event("auth:session-changed"));
    }

    refreshQueue.forEach((cb) => cb(newToken));
    refreshQueue = [];
    return newToken;
  } catch {
    refreshQueue.forEach((cb) => cb(null));
    refreshQueue = [];
    return null;
  } finally {
    isRefreshing = false;
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  isRetry = false
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const token = getStoredToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...options,
    credentials: "include",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    payload = null;
  }

  const hasSessionToken = Boolean(token);

  if (response.status === 401 && !isRetry) {
    const newToken = await attemptRefresh();
    if (newToken) {
      return request<T>(path, options, true);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw new UnauthorizedError(payload?.message ?? "No autorizado", payload?.code);
  }

  if (response.status === 401 && isRetry) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw new UnauthorizedError(payload?.message ?? "No autorizado", payload?.code);
  }

  if (!response.ok) {
    throw new ApiClientError(
      payload?.message ?? "Ocurrio un error inesperado",
      response.status,
      payload?.code,
    );
  }

  if (!payload) {
    throw new ApiClientError("La respuesta del backend no tiene el formato esperado");
  }

  return payload;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  del: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
