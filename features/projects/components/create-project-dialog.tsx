"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateProject, type CreateProjectRequest } from "@/features/projects/hooks/use-project-mutations";
import { toast } from "@/hooks/use-toast";

const ENERGY_TYPES = [
  { value: "SOLAR", label: "Solar" },
  { value: "WIND", label: "Eolica" },
  { value: "HYDRO", label: "Hidroelectrica" },
  { value: "BIOMASS", label: "Biomasa" },
] as const;

const EMPTY: CreateProjectRequest = {
  name: "",
  description: "",
  energyType: "SOLAR",
  province: "",
  country: "",
  totalTokens: "",
  earlyBirdPrice: "",
  standardPrice: "",
  softCap: "",
  hardCap: "",
  minimumInvestment: "",
  expectedAnnualYield: "",
  expectedOpenDate: "",
};

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateProjectRequest>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const create = useCreateProject();

  function set(key: keyof CreateProjectRequest, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.totalTokens ||
      !form.earlyBirdPrice ||
      !form.standardPrice ||
      !form.softCap ||
      !form.hardCap
    ) {
      setError(
        "Completa los campos obligatorios: nombre, descripcion, total de tokens, early bird price, standard price, soft cap y hard cap."
      );
      return;
    }

    if (Number(form.earlyBirdPrice) >= Number(form.standardPrice)) {
      setError("El early bird price debe ser estrictamente menor que el standard price.");
      return;
    }

    if (Number(form.softCap) <= 0 || Number(form.hardCap) <= 0) {
      setError("Soft cap y hard cap deben ser mayores a cero.");
      return;
    }

    if (Number(form.softCap) >= Number(form.hardCap)) {
      setError("El soft cap debe ser estrictamente menor que el hard cap.");
      return;
    }

    try {
      await create.mutateAsync(form);
      toast({
        title: "Proyecto enviado",
        description: "Quedo a la espera de aprobacion de un administrador.",
      });
      setOpen(false);
      setForm(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el proyecto.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Crear proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Nuevo Proyecto</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Completa los datos del proyecto. Los campos marcados con <span className="text-primary">*</span> son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-project-form"
          onSubmit={handleSubmit}
          className="space-y-5 py-2 [&_input]:border-border [&_textarea]:border-border [&_[data-slot=select-trigger]]:border-border"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" placeholder="Ej: Solar Valley Norte" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripcion *</Label>
            <Textarea id="description" placeholder="Descripcion del proyecto y sus objetivos..." value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Tipo de energia *</Label>
              <Select value={form.energyType} onValueChange={(v) => set("energyType", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="[&_[data-slot=select-item]]:focus:bg-primary/15 [&_[data-slot=select-item]]:focus:text-foreground [&_[data-slot=select-item]]:data-[state=checked]:text-primary">
                  {ENERGY_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pais</Label>
              <Input id="country" placeholder="Argentina" value={form.country ?? ""} onChange={(e) => set("country", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provincia / Region</Label>
              <Input id="province" placeholder="Mendoza" value={form.province ?? ""} onChange={(e) => set("province", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="totalTokens">Total de tokens *</Label>
              <Input id="totalTokens" type="number" min="1" placeholder="200000" value={form.totalTokens} onChange={(e) => set("totalTokens", e.target.value)} required />
              <p className="text-xs text-muted-foreground">
                Tramo asignado a la ronda primaria (LKN que el emisor deposita en escrow).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumInvestment">Inversion minima (USD)</Label>
              <Input id="minimumInvestment" type="number" min="0.01" step="0.01" placeholder="100.00" value={form.minimumInvestment ?? ""} onChange={(e) => set("minimumInvestment", e.target.value)} />
            </div>
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <h4 className="text-sm font-semibold text-foreground">Precios por etapa</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Durante la ronda los inversores pagan el <span className="font-medium">early bird</span>.
              Cuando la ronda cierra exitosamente, el precio sube al <span className="font-medium">standard</span>.
              El contrato exige que <span className="font-medium">early bird &lt; standard</span>.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="earlyBirdPrice">Early bird (USD por LKN) *</Label>
                <Input
                  id="earlyBirdPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="8.00"
                  value={form.earlyBirdPrice}
                  onChange={(e) => set("earlyBirdPrice", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standardPrice">Standard (USD por LKN) *</Label>
                <Input
                  id="standardPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="10.00"
                  value={form.standardPrice}
                  onChange={(e) => set("standardPrice", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-secondary/20 p-4">
            <h4 className="text-sm font-semibold text-foreground">Objetivos de recaudacion</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              El <span className="font-medium">soft cap</span> es el minimo a recaudar para que la ronda sea exitosa.
              El <span className="font-medium">hard cap</span> es el maximo que puede captar el proyecto.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="softCap">Soft cap (USD) *</Label>
                <Input
                  id="softCap"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="500000.00"
                  value={form.softCap ?? ""}
                  onChange={(e) => set("softCap", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hardCap">Hard cap (USD) *</Label>
                <Input
                  id="hardCap"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="1600000.00"
                  value={form.hardCap ?? ""}
                  onChange={(e) => set("hardCap", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expectedAnnualYield">APY estimado (%)</Label>
              <Input id="expectedAnnualYield" type="number" min="0" step="0.01" placeholder="12.50" value={form.expectedAnnualYield ?? ""} onChange={(e) => set("expectedAnnualYield", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="expectedOpenDate">Apertura esperada del parque</Label>
              <Input
                id="expectedOpenDate"
                type="date"
                value={form.expectedOpenDate ?? ""}
                onChange={(e) => set("expectedOpenDate", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Esta fecha tambien es el deadline del soft cap on-chain. Si llega sin superar el soft cap,
                la ronda falla y los inversores reclaman refund.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="installedCapacityMW">Capacidad (MW)</Label>
              <Input id="installedCapacityMW" type="number" min="0" step="0.001" placeholder="5.000" value={form.installedCapacityMW ?? ""} onChange={(e) => set("installedCapacityMW", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitud</Label>
              <Input id="latitude" type="number" step="0.000001" placeholder="-32.888" value={form.latitude ?? ""} onChange={(e) => set("latitude", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitud</Label>
              <Input id="longitude" type="number" step="0.000001" placeholder="-68.844" value={form.longitude ?? ""} onChange={(e) => set("longitude", e.target.value)} />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </form>

        <DialogFooter className="border-t border-border pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} type="button">
            Cancelar
          </Button>
          <Button form="create-project-form" type="submit" disabled={create.isPending} className="gap-2">
            {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Crear proyecto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
