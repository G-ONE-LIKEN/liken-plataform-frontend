"use client";

import { useState } from "react";
import { Megaphone, Loader2, Send, Mail, Users, ShieldCheck, Building2, User } from "lucide-react";
import { AccessGate } from "@/features/auth/components/access-gate";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/shared/lib/api-client";
import { toast } from "@/hooks/use-toast";

type Audience = "ALL" | "ADMINS" | "DEVELOPERS" | "INVESTORS" | "USER";

const AUDIENCE_OPTIONS: { value: Audience; label: string; icon: React.ElementType; description: string }[] = [
  { value: "ALL",        label: "Todos los usuarios",     icon: Users,      description: "Cualquier cuenta activa de la plataforma" },
  { value: "ADMINS",     label: "Administradores",        icon: ShieldCheck, description: "Solo cuentas con rol ADMIN o SUPER_ADMIN" },
  { value: "DEVELOPERS", label: "Desarrolladores",        icon: Building2,  description: "Cuentas con rol DEVELOPER" },
  { value: "INVESTORS",  label: "Inversores",             icon: Users,      description: "Usuarios estándar de la plataforma" },
  { value: "USER",       label: "Un usuario específico",  icon: User,       description: "Indicá el ID del usuario destino" },
];

function BroadcastContent() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<Audience>("ALL");
  const [userId, setUserId] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast({ title: "Completá los campos", variant: "destructive" });
      return;
    }
    if (audience === "USER" && !userId.trim()) {
      toast({ title: "Indicá el ID del usuario", variant: "destructive" });
      return;
    }
    setPending(true);
    try {
      const res = await apiClient.post<{ recipients: number }>(
        "/api/notifications/broadcast",
        {
          title: title.trim(),
          body: body.trim(),
          audience,
          userId: audience === "USER" ? Number(userId) : null,
          sendEmail,
        },
      );
      toast({
        title: "Mensaje enviado",
        description: `Llegó a ${res.data.recipients} usuario(s).`,
      });
      setTitle("");
      setBody("");
      setUserId("");
      setSendEmail(false);
    } catch (err) {
      toast({
        title: "Error al enviar",
        description: err instanceof Error ? err.message : "Error inesperado.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  }

  const selectedOption = AUDIENCE_OPTIONS.find((o) => o.value === audience)!;
  const Icon = selectedOption.icon;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administración"
        title="Enviar notificación"
        description="Envíá un mensaje a una audiencia de la plataforma. Aparece como notificación in-app y, opcionalmente, también por email."
      />

      <form onSubmit={handleSend} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Megaphone className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-foreground">Contenido del mensaje</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ej: Mantenimiento programado mañana"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Mensaje *</Label>
              <Textarea
                id="body"
                placeholder="Detalles del anuncio..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                maxLength={4000}
                required
              />
              <p className="text-xs text-muted-foreground">{body.length} / 4000 caracteres</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-foreground">Destinatarios</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Audiencia</Label>
              <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{selectedOption.description}</p>
            </div>

            {audience === "USER" && (
              <div className="space-y-2">
                <Label htmlFor="userId">ID del usuario *</Label>
                <Input
                  id="userId"
                  type="number"
                  min="1"
                  placeholder="123"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>
            )}

            <label className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Enviar también por email</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Si está marcado, además de la notificación in-app se enviará un email a cada destinatario.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="submit" disabled={pending} className="gap-2">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Enviar notificación
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function BroadcastPage() {
  return (
    <AccessGate allow={(ctx) => ctx.isAdmin}>
      <BroadcastContent />
    </AccessGate>
  );
}
