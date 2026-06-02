"use client";

import { env } from "@/shared/config/env";
import type { ApiResponse } from "@/shared/types/api";

export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const SESSION_TOKEN_KEY = "liken.session.token";

function readCookieToken() {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("liken_session_token="));
  return entry ? decodeURIComponent(entry.split("=").slice(1).join("=")) : null;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_TOKEN_KEY) ?? readCookieToken();
}

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function attemptRefresh(): Promise<string | null> {
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
      window.localStorage.setItem(SESSION_TOKEN_KEY, newToken);
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

  if (response.status === 401 && !isRetry && hasSessionToken) {
    const newToken = await attemptRefresh();
    if (newToken) {
      return request<T>(path, options, true);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw new UnauthorizedError("No autorizado");
  }

  if (response.status === 401 && isRetry && hasSessionToken) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw new UnauthorizedError("No autorizado");
  }

  if (!response.ok) {
    throw new Error(payload?.message ?? "Ocurrió un error inesperado");
  }

  if (!payload) {
    throw new Error("La respuesta del backend no tiene el formato esperado");
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
