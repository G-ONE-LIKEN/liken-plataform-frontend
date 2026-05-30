"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { getPermissionContext, parseSessionToken } from "@/features/auth/lib/session";
import type { PermissionContext, SessionUser } from "@/features/auth/types/auth";

const SESSION_TOKEN_KEY = "liken.session.token";
const SESSION_TOKEN_COOKIE = "liken_session_token";
const SESSION_EVENT = "auth:session-changed";

type SessionContextValue = {
  token: string | null;
  user: SessionUser | null;
  permissions: PermissionContext;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

function readCookieToken() {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${SESSION_TOKEN_COOKIE}=`));
  return entry ? decodeURIComponent(entry.split("=").slice(1).join("=")) : null;
}

function writeCookieToken(token: string) {
  document.cookie = `${SESSION_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
}

function clearCookieToken() {
  document.cookie = `${SESSION_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

function readStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_TOKEN_KEY) ?? readCookieToken();
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === SESSION_TOKEN_KEY) callback();
  };
  const handleSessionChange = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SESSION_EVENT, handleSessionChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SESSION_EVENT, handleSessionChange);
  };
}

function emitSessionChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_EVENT));
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, readStoredToken, () => null);

  const user = useMemo<SessionUser | null>(() => {
    if (!token) return null;
    try {
      return parseSessionToken(token);
    } catch {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(SESSION_TOKEN_KEY);
        clearCookieToken();
        emitSessionChanged();
      }
      return null;
    }
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(SESSION_TOKEN_KEY);
        clearCookieToken();
        emitSessionChanged();
      }
      router.push("/login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [router]);

  const login = useCallback((nextToken: string) => {
    window.localStorage.setItem(SESSION_TOKEN_KEY, nextToken);
    writeCookieToken(nextToken);
    emitSessionChanged();
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_TOKEN_KEY);
    clearCookieToken();
    emitSessionChanged();
    router.push("/login");
  }, [router]);

  const value = useMemo<SessionContextValue>(
    () => ({
      token,
      user,
      permissions: getPermissionContext(user),
      isAuthenticated: Boolean(token && user),
      isLoading: false,
      login,
      logout,
    }),
    [token, user, login, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession debe usarse dentro de SessionProvider");
  return context;
}
