"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { getPermissionContext, parseSessionToken } from "@/features/auth/lib/session";
import type { PermissionContext, SessionUser } from "@/features/auth/types/auth";
import { env } from "@/shared/config/env";


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
  refreshContext: () => Promise<void>;
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
  const [freshUser, setFreshUser] = useState<SessionUser | null>(null);
  const fetchingRef = useRef(false);

  const jwtUser = useMemo<SessionUser | null>(() => {
    if (!token) return null;
    try {
      return parseSessionToken(token);
    } catch {
      return null;
    }
  }, [token]);

  // Cleanup invalid token outside of render phase
  useEffect(() => {
    if (token && !jwtUser) {
      window.localStorage.removeItem(SESSION_TOKEN_KEY);
      clearCookieToken();
      emitSessionChanged();
    }
  }, [token, jwtUser]);

  // Fetch fresh role/permissions from the backend
  const fetchContext = useCallback(async (currentToken: string) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const res = await fetch(`${env.apiUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (!res.ok) return;
      const body = await res.json();
      const ctx = body.data;
      if (!ctx) return;
      setFreshUser((prev) => ({
        ...(prev ?? { id: ctx.userId, email: "", exp: undefined }),
        id: ctx.userId,
        role: ctx.role ?? "BASIC",
        permissions: Array.isArray(ctx.permissions) ? ctx.permissions : [],
      }));
    } catch {
      // silently fail — fall back to JWT data
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  // Fetch on mount and whenever the token changes
  useEffect(() => {
    if (token && jwtUser) {
      fetchContext(token);
    } else {
      setFreshUser(null);
    }
  }, [token, jwtUser, fetchContext]);

  const refreshContext = useCallback(async () => {
    if (token) await fetchContext(token);
  }, [token, fetchContext]);

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
    setFreshUser(null);
    emitSessionChanged();
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${env.apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // best-effort — clear local state regardless
    }
    window.localStorage.removeItem(SESSION_TOKEN_KEY);
    clearCookieToken();
    setFreshUser(null);
    emitSessionChanged();
    router.push("/login");
  }, [router]);

  // Merge: use JWT for id/email/exp, use freshUser for role/permissions
  const user = useMemo<SessionUser | null>(() => {
    if (!jwtUser) return null;
    return {
      ...jwtUser,
      role: freshUser?.role ?? jwtUser.role,
      permissions: freshUser?.permissions ?? jwtUser.permissions,
    };
  }, [jwtUser, freshUser]);

  const value = useMemo<SessionContextValue>(
    () => ({
      token,
      user,
      permissions: getPermissionContext(user),
      isAuthenticated: Boolean(token && jwtUser),
      isLoading: false,
      login,
      logout,
      refreshContext,
    }),
    [token, user, jwtUser, login, logout, refreshContext],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession debe usarse dentro de SessionProvider");
  return context;
}
