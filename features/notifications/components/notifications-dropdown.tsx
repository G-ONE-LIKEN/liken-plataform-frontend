"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2, MailOpen } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useMarkAllAsRead, useMarkAsRead, useNotifications, useNotificationStream, useUnreadCount,
} from "@/features/notifications/hooks/use-notifications";
import type { AppNotification } from "@/features/notifications/types";

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return "ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function getActionUrl(n: AppNotification): string | undefined {
  const url = (n.data as { url?: string })?.url;
  return typeof url === "string" ? url : undefined;
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useNotificationStream();
  const unreadCountQuery = useUnreadCount();
  const listQuery = useNotifications(false);
  const markRead = useMarkAsRead();
  const markAllRead = useMarkAllAsRead();

  const unread = unreadCountQuery.data ?? 0;
  const items = (listQuery.data?.content ?? []).slice(0, 8);

  async function handleClick(n: AppNotification) {
    if (!n.read) {
      try { await markRead.mutateAsync(n.id); } catch { /* noop */ }
    }
    setOpen(false);
    const url = getActionUrl(n);
    if (url) router.push(url);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Notificaciones</p>
            <p className="text-xs text-muted-foreground">
              {unread > 0 ? `${unread} sin leer` : "Sin nuevas"}
            </p>
          </div>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              {markAllRead.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCheck className="h-3 w-3" />}
              Marcar todas
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {listQuery.isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <MailOpen className="mb-2 h-7 w-7 text-muted-foreground/40" />
              <p className="text-sm text-foreground">Sin notificaciones</p>
              <p className="text-xs text-muted-foreground">Te avisaremos cuando algo nuevo pase.</p>
            </div>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleClick(n)}
                className={`w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-secondary/50 ${
                  n.read ? "" : "bg-primary/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm ${n.read ? "text-foreground" : "font-semibold text-foreground"}`}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                    )}
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="border-t border-border p-2">
          <Button asChild variant="ghost" className="w-full justify-center text-xs">
            <Link href="/dashboard/notifications" onClick={() => setOpen(false)}>
              Ver todas las notificaciones
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
