import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Card } from "@/shared/ui/card";

type StatPanelProps = {
  label: string;
  value: string;
  hint: string;
  trend?: "up" | "down" | "neutral";
};

export function StatPanel({ label, value, hint, trend }: StatPanelProps) {
  return (
    <Card className="h-full">
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">{value}</p>
          {trend === "up" && <ArrowUp className="h-4 w-4 text-[var(--color-success)]" />}
          {trend === "down" && <ArrowDown className="h-4 w-4 text-[var(--color-danger)]" />}
          {trend === "neutral" && <Minus className="h-4 w-4 text-[var(--color-foreground-subtle)]" />}
        </div>
        <p className="text-sm leading-6 text-[var(--color-foreground-muted)]">{hint}</p>
      </div>
    </Card>
  );
}
