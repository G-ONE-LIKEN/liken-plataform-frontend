"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { env } from "@/shared/config/env";
import { useSession } from "@/providers/session-provider";
import type { AppNotification, NotificationsPage } from "@/features/notifications/types";

const KEY = ["notifications"];
const UNREAD_KEY = ["notifications", "unread-count"];

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: [...KEY, unreadOnly ? "unread" : "all"],
    queryFn: async () => {
      const url = `/api/notifications?unread=${unreadOnly}&size=30`;
      const response = await apiClient.get<NotificationsPage>(url);
      return response.data;
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: UNREAD_KEY,
    queryFn: async () => {
      const response = await apiClient.get<{ count: number }>("/api/notifications/unread-count");
      return response.data.count;
    },
    // El badge se actualiza con SSE además del fetch inicial.
    staleTime: 60_000,
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.post(`/api/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: UNREAD_KEY });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/api/notifications/read-all", {});
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: UNREAD_KEY });
    },
  });
}

/**
 * Conecta al stream SSE de notificaciones del backend. Cada notificación nueva
 * incrementa el badge de no leídas y refresca la lista. El browser reconecta
 * automáticamente si la conexión se corta.
 *
 * Nota: el endpoint requiere autenticación. El gateway acepta el token JWT
 * por query param `access_token` para compatibilidad con EventSource (que no
 * permite headers custom).
 */
export function useNotificationStream() {
  const { token, isAuthenticated } = useSession();
  const qc = useQueryClient();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setConnected(false);
      return;
    }
    const url = `${env.apiUrl}/api/notifications/stream?access_token=${encodeURIComponent(token)}`;
    const source = new EventSource(url, { withCredentials: true });

    source.addEventListener("connected", () => setConnected(true));

    source.addEventListener("notification", (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data) as AppNotification;
        qc.setQueryData(UNREAD_KEY, (prev?: number) => (prev ?? 0) + 1);
        qc.invalidateQueries({ queryKey: KEY });
        // Hook simple para que componentes consumidores puedan reaccionar
        window.dispatchEvent(new CustomEvent("notification:new", { detail: data }));
      } catch {
        // ignore
      }
    });

    source.onerror = () => {
      setConnected(false);
      // EventSource reconecta solo, no cerramos el source para no romper el ciclo.
    };

    return () => {
      source.close();
      setConnected(false);
    };
  }, [isAuthenticated, token, qc]);

  return { connected };
}
