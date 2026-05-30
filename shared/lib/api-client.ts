"use client";

import { env } from "@/shared/config/env";
import type { ApiResponse } from "@/shared/types/api";

export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "No tenes permisos para realizar esta accion") {
    super(message);
    this.name = "ForbiddenError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function readCookieToken() {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("liken_session_token="));
  return entry ? decodeURIComponent(entry.split("=").slice(1).join("=")) : null;
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("liken.session.token") ?? readCookieToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw new UnauthorizedError("No autorizado");
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (response.status === 403) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:forbidden"));
      }
      throw new ForbiddenError(payload?.message ?? "No tenes permisos para realizar esta accion");
    }
    throw new Error(payload?.message ?? "Ocurrio un error inesperado");
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
