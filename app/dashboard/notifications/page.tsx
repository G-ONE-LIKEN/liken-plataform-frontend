"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Loader2, MailOpen, Bell } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/shared/ui/badge";
import {
  useMarkAllAsRead, useMarkAsRead, useNotifications, useUnreadCount,
} from "@/features/notifications/hooks/use-notifications";
import type { AppNotification } from "@/features/notifications/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" });
}

function getActionUrl(n: AppNotification): string | undefined {
  const url = (n.data as { url?: string })?.url;
  return typeof url === "string" ? url : undefined;
}

function NotificationRow({ n }: { n: AppNotification }) {
  const router = useRouter();
  const markRead = useMarkAsRead();

  async function handleClick() {
    if (!n.read) {
      try { await markRead.mutateAsync(n.id); } catch { /* noop */ }
    }
    const url = getActionUrl(n);
    if (url) router.push(url);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group w-full rounded-xl border border-border px-4 py-3 text-left transition-colors hover:border-primary/40 ${
        n.read ? "bg-card" : "bg-primary/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          n.read ? "bg-secondary text-muted-foreground" : "bg-primary/15 text-primary"
        }`}>
          <Bell className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <p className={`flex-1 ${n.read ? "text-foreground" : "font-semibold text-foreground"}`}>
              {n.title}
            </p>
            {!n.read && <Badge tone="brand">Nueva</Badge>}
          </div>
          {n.body && (
            <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{n.body}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
        </div>
      </div>
    </button>
  );
}

function NotificationsList({ unread }: { unread: boolean }) {
  const query = useNotifications(unread);
  if (query.isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }
  const items = query.data?.content ?? [];
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <MailOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">
          {unread ? "No tenés notificaciones sin leer" : "Sin notificaciones"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Te avisamos cuando algo nuevo ocurra.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((n) => <NotificationRow key={n.id} n={n} />)}
    </div>
  );
}

export default function NotificationsPage() {
  const unread = useUnreadCount();
  const markAll = useMarkAllAsRead();
  const [tab, setTab] = useState<"all" | "unread">("all");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tu actividad"
        title="Notificaciones"
        description="Todo lo importante que pasa en tu cuenta y en la plataforma."
        actions={
          (unread.data ?? 0) > 0 ? (
            <Button onClick={() => markAll.mutate()} disabled={markAll.isPending} className="gap-1.5">
              {markAll.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
              Marcar todas como leídas
            </Button>
          ) : null
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "unread")}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="unread" className="gap-1.5">
            No leídas
            {(unread.data ?? 0) > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                {unread.data}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <NotificationsList unread={false} />
        </TabsContent>
        <TabsContent value="unread" className="mt-6">
          <NotificationsList unread={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
